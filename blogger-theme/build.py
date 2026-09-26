#!/usr/bin/env python3
"""Build the Blogger theme XML and the local preview pages.

  python3 blogger-theme/build.py

Outputs:
  dist/oneofkind77-blogger-theme.xml   upload in Blogger → Theme → ⋮ → Restore
  blogger-theme/preview/*.html         static previews of the design (sample content)
"""
import pathlib
import re
import urllib.parse
import xml.dom.minidom

VERSION = "v11"  # bump when publishing a new file, so downloads are easy to tell apart
ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT.parent / "dist"

def svg_uri(name):
    svg = re.sub(r"\s+", " ", (SRC / name).read_text())
    return "data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/,;.-_()'")

skin = (SRC / "skin.css").read_text()
for token, name in (("@HERO@", "hero.svg"), ("@DESERT@", "desert.svg"), ("@AMERICANA@", "americana.svg")):
    skin = skin.replace(token, svg_uri(name))

script = (SRC / "script.js").read_text()

assert "]]>" not in skin and "]]>" not in script
assert "$" not in skin, "Blogger skin treats $ as a variable marker"

template = (SRC / "template.xml").read_text()
theme = template.replace("/*@SKIN@*/", skin).replace("/*@SCRIPT@*/", script)
xml.dom.minidom.parseString(theme.encode("utf-8"))  # must be well-formed XML
DIST.mkdir(exist_ok=True)
(DIST / "oneofkind77-blogger-theme.xml").write_text(theme)
(DIST / f"oneofkind77-theme-{VERSION}.xml").write_text(theme)

# ---------- Preview pages (sample content, mirrors the template's rendered markup) ----------
head = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{title}}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet">
<script>document.documentElement.className += ' js';</script>
<style>{skin}</style></head>"""

def between(start, end):
    s = template.index(start)
    return template[s:template.index(end, s)]

def render(fragment, body_class, main_html):
    html = fragment
    html = html.replace("<data:blog.title/>", "One of Kind 77")
    html = re.sub(r"expr:href='data:blog.homepageUrl'", "href='index.html'", html)
    html = html.replace("{MAIN}", main_html)
    return html

header = between("<header class='site-header'", "<main id='main-content'>")
header = re.sub(r"<b:section.*?</b:section>", "<div class='widget PageList'><div class='widget-content'><ul><li class='selected'><a href='index.html'>Home</a></li><li><a href='#'>About</a></li><li><a href='#'>Contact</a></li><li><a href='#'>Privacy Policy</a></li></ul></div></div>", header, flags=re.S)
footer = between("<footer class='site-footer'>", "<script>\n  //<![CDATA[\n/*@SCRIPT@*/")
footer = re.sub(r"<b:section.*?</b:section>", "<div class='section footer-links' id='footer'><div class='widget PageList'><div class='widget-content'><ul><li><a href='#'>About</a></li><li><a href='#'>Contact</a></li><li><a href='#'>Privacy Policy</a></li></ul></div></div></div>", footer, flags=re.S)
home_top = between("<!-- ===== Hero ===== -->", "\n    </b:if>\n\n    <!-- ===== Start here")
focus = between("<section class='band desert-bg home-only' id='guides'>", "\n\n    <!-- ===== Posts")
cta = between("<section class='cta-wrap'>", "</b:if>\n  </main>")

posts = [  # sample content for the preview only
    ("Tipping", "Tipping in America: Who, When and How Much", "Restaurants, delivery, haircuts and hotels — a simple cheat sheet you can save on your phone."),
    ("Holidays", "Thanksgiving Explained: What Happens at the Table", "Turkey, family traditions, football and the day-after shopping rush."),
    ("Small Talk", "How to Make Small Talk Like an American", "Easy openers, safe topics and why strangers say “How are you?”"),
    ("Shopping", "Grocery Shopping in the U.S.: A First-Timer’s Guide", "Store brands, coupons, loyalty cards and bagging your own groceries."),
    ("Holidays", "Halloween for Beginners: Costumes, Candy and Pumpkins", "What trick-or-treating looks like and how neighborhoods join in."),
    ("Tipping", "Is Tipping Required? The Unwritten Rules", "When 20% is expected, when it isn’t, and what to do at a counter."),
]
cards = "".join(f"""<article class='post-card reveal'><a class='post-card-img' href='post.html' tabindex='-1'><span aria-hidden='true' class='post-card-fallback'>&#9733;</span></a>
<div class='post-card-body'><p class='post-card-meta'><a class='post-card-label' href='#'>{l}</a><time>September {20 - i}, 2026</time></p>
<h2 class='post-card-title'><a href='post.html'>{t}</a></h2><p class='post-card-excerpt'>{e}</p><a class='post-card-more' href='post.html'>Read more &#8594;</a></div></article>""" for i, (l, t, e) in enumerate(posts))
grid = f"<div class='post-grid'>{cards}</div><div class='blog-pager' id='blog-pager'><a class='blog-pager-older-link' href='#'>More posts</a></div>"
labels = "".join(f"<li><a class='label-name' href='#'>{n}<span class='label-count'>{c}</span></a></li>" for n, c in [("Credit Cards", 1), ("Fall Guides", 2), ("Halloween", 3), ("Holidays & Culture", 2), ("Money & Insurance", 1), ("Travel & Outdoors", 1)])
focus = re.sub(r"<b:section[^>]*/>", "", focus)
mock = """<script>window.__feedMock = {
 'Holidays & Culture': [{title: 'Hispanic Heritage Month Explained: Why It Starts in Mid-September', url: 'post.html?p=1', date: '2026-09-24'}],
 'Halloween': [{title: 'Halloween Candy in America: What to Hand Out and Skip', url: 'post.html?p=2', date: '2026-09-20'},
               {title: '2026 Halloween Practical Guide: When, Where, and What to Prepare', url: 'post.html?p=3', date: '2026-09-20'},
               {title: 'Halloween Costume Ideas by Age: From Toddlers to Adults', url: 'post.html?p=4', date: '2026-09-19'}],
 'Money & Insurance': [{title: 'Q4 2026 Credit Card Bonus Categories: Don’t Forget to Activate', url: 'post.html?p=5', date: '2026-09-25'}],
 'Travel & Outdoors': [{title: 'Fall Foliage Road Trips: Where to Go This October', url: 'post.html?p=6', date: '2026-09-18'}]
};</script>"""
popular = "".join(f"<article class='post'><div class='post-content'><a class='post-image-link' href='post.html'><img class='post-thumb' alt='' src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 3 2%22%3E%3Crect width=%223%22 height=%222%22 fill=%22%232b3e6b%22/%3E%3C/svg%3E'></a><h3 class='post-title'><a href='post.html'>{t}</a></h3></div></article>" for _, t, _ in posts[:4])
topics = f"""<section class='band section-paper home-only' id='topics'><div class='container popular-wrap'>
<div class='popular section'><div class='widget PopularPosts'><h3 class='title'>Most read</h3><div class='widget-content popular-posts'><div role='feed'>{popular}</div></div></div></div>
</div></section>"""

latest = "<div class='section-head reveal latest-head' id='latest'><p class='eyebrow'>Fresh on the blog</p><h2>Latest posts</h2></div>"
index_html = (head.replace("{title}", "Preview – Home").replace("</head>", mock + "</head>") + "<body class='is-home'>" + render(header, "", "") + "<main id='main-content'>"
    + render(home_top, "", "") + focus + f"<div class='posts-zone'><div class='container main-wrap'>{latest}{grid}</div></div>" + topics + cta + "</main>" + render(footer, "", "")
    + f"<script>{script}</script></body></html>")

article = """<p>Halloween candy is a big deal in the United States. On October 31, neighbors open their doors to trick-or-treaters, and the bowl by the door says a lot about the house.</p>
<h2>What kids hope to find</h2>
<p>Full-size chocolate bars are legendary, but fun-size chocolate is the everyday favorite. Peanut butter cups and chocolate bars with caramel almost always go first.</p>
<ul><li><strong>Chocolate</strong> — the safest choice for most kids.</li><li><strong>Sour and fruity candy</strong> — popular with older kids.</li><li><strong>Non-candy treats</strong> — stickers or small toys for kids with allergies.</li></ul>
<blockquote>A teal pumpkin on the porch means the house offers allergy-friendly treats.</blockquote>
<h2>What to skip</h2>
<p>Homemade treats and anything unwrapped usually end up in the trash — parents check every piece.</p>
<hr><p>What did you hand out last year? Share it in the comments.</p>"""
post_main = f"""<div class='posts-zone'><div class='container main-wrap'><article class='post-single'><header class='post-hero'><p class='eyebrow'><a href="#">Tipping</a></p>
<h1 class='post-title entry-title'>Halloween Candy in America: What to Hand Out and Skip</h1><p class='post-meta'>By One of Kind 77 &#183; <time>September 20, 2026</time></p></header>
<div aria-hidden='true' class='stripe'></div><div class='post-body entry-content'>{article}</div>
<p class='post-tags'><a href='#'>#Halloween</a><a href='#'>#Holidays & Culture</a></p><section aria-live='polite' class='journey-next' hidden id='journey-next'><p class='eyebrow'>Keep reading</p><h2 class='journey-title'>More in <span class='journey-pillar'>this topic</span></h2><div class='journey-list'></div><a class='text-link journey-all' href='#'>See the whole series &#8594;</a></section></article>
<section class='comments' id='comments'><h3 class='title'>2 comments</h3><div class='comment-thread'><ol><li class='comment'><div class='comment-header'><cite class='user'><a href='#'>Min</a></cite><span class='datetime'><a href='#'>September 21, 2026</a></span></div><p class='comment-content'>This was so helpful, thank you!</p><span class='comment-actions'><a href='#'>Reply</a></span></li></ol></div></section>
<div class='blog-pager' id='blog-pager'><a class='blog-pager-newer-link' href='#'>Newer post</a><a class='blog-pager-older-link' href='#'>Older post</a></div></div></div>"""
post_html = (head.replace("{title}", "Preview – Post").replace("</head>", mock + "</head>") + "<body class='is-single'>" + render(header, "", "") + "<main id='main-content'>" + post_main + "</main>"
    + render(footer, "", "") + f"<script>{script}</script></body></html>")

(ROOT / "preview").mkdir(exist_ok=True)
(ROOT / "preview" / "index.html").write_text(index_html)
(ROOT / "preview" / "post.html").write_text(post_html)
print("built", DIST / "oneofkind77-blogger-theme.xml", f"{len(theme) // 1024} KB")
