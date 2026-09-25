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

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT.parent / "dist"

def svg_uri(name):
    svg = re.sub(r"\s+", " ", (SRC / name).read_text())
    return "data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/,;.-_()'")

skin = (SRC / "skin.css").read_text()
for token, name in (("@HERO@", "hero.svg"), ("@DESERT@", "desert.svg"), ("@AMERICANA@", "americana.svg")):
    skin = skin.replace(token, svg_uri(name))

# "Start here" guide cards (trading-card style). (title, type, level, query, strip, [moves], footer, flavor, icon)
ICONS = {
    "house": "<path d='M6 22 24 8l18 14'/><path d='M11 19v21h26V19'/><path d='M20 40V28h8v12'/>",
    "card": "<rect height='26' rx='3' width='38' x='5' y='11'/><path d='M5 19h38M11 29h10'/>",
    "shield": "<path d='M24 6 9 12v10c0 10 6.5 17 15 20 8.5-3 15-10 15-20V12Z'/><path d='M24 17v14M17 24h14'/>",
    "car": "<path d='M8 30l4-11c.7-2 2.3-3 4.3-3h15.4c2 0 3.6 1 4.3 3l4 11'/><rect height='10' rx='3' width='36' x='6' y='28'/><path d='M12 38v4M36 38v4'/>",
    "case": "<rect height='26' rx='3' width='38' x='5' y='15'/><path d='M17 15v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 26h38'/>",
    "bag": "<path d='M10 16h28l-3 24H13Z'/><path d='M17 16a7 7 0 0 1 14 0'/>",
}
GUIDES = [
    ("Housing &amp; Moving", "grass", 10, "housing", "Newcomer Guide &#183; Home &amp; Rent",
     [("Find a Rental", "Applications, credit checks and security deposits.", "01"), ("Set Up Utilities", "Power, water, internet and trash &#8212; who to call first.", "02")],
     "Every new chapter starts with a front door.", "house"),
    ("Money &amp; Credit", "lightning", 20, "credit", "Newcomer Guide &#183; Banking",
     [("Open a Bank Account", "Checking vs. savings, and what documents to bring.", "01"), ("Build Credit", "Secured cards and the habits that raise your score.", "02")],
     "Your credit score opens more doors than you think.", "card"),
    ("Health &amp; Insurance", "water", 30, "insurance", "Newcomer Guide &#183; Healthcare",
     [("Pick a Plan", "Premiums, deductibles and copays in plain English.", "01"), ("See a Doctor", "Primary care, urgent care or the ER &#8212; which one?", "02")],
     "Know your plan before you need it.", "shield"),
    ("Cars &amp; Driving", "fire", 40, "driving", "Newcomer Guide &#183; On the Road",
     [("Get Your License", "Documents, the written test and the road test.", "01"), ("Buy a Car", "New vs. used, loans, insurance and registration.", "02")],
     "In most of America, the car is the key to everything.", "car"),
    ("Work &amp; Careers", "steel", 50, "work", "Newcomer Guide &#183; Jobs",
     [("Land the Job", "R&#233;sum&#233;s, interviews and work authorization basics.", "01"), ("Read Your Paycheck", "Taxes, Social Security, Medicare and benefits.", "02")],
     "Work hard &#8212; and understand the pay stub too.", "case"),
    ("Everyday Life", "psychic", 60, "culture", "Newcomer Guide &#183; Culture",
     [("Tip Like a Local", "Restaurants, delivery, haircuts and hotels.", "01"), ("Make Small Talk", "The friendly chats Americans have everywhere.", "02")],
     "The little customs make the biggest difference.", "bag"),
]

def guide_card(n, g):
    title, typ, lv, q, strip, moves, flavor, icon = g
    rows = "".join(
        f"<div class='tcg-move'><span aria-hidden='true' class='cost'>{'<i></i>' * (k + 1)}</span>"
        f"<div><b>{name}</b><p>{text}</p></div><span class='tcg-dmg'>{dmg}</span></div>"
        for k, (name, text, dmg) in enumerate(moves))
    return (f"            <a class='tcg t-{typ} reveal' href='/search?q={q}'>\n"
            f"              <div class='tcg-inner'>\n"
            f"                <div class='tcg-top'><span class='tcg-stage'>Basic Guide</span><span class='tcg-no'>No. {n:03d}/{len(GUIDES):03d}</span></div>\n"
            f"                <div class='tcg-head'><h3 class='tcg-name'>{title}</h3><span class='tcg-hp'><small>LV</small>{lv}<span aria-hidden='true' class='energy'></span></span></div>\n"
            f"                <div class='tcg-art'><span class='tcg-art-in'><svg aria-hidden='true' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>{ICONS[icon]}</svg></span></div>\n"
            f"                <div class='tcg-strip'>{strip}</div>\n"
            f"                {rows}\n"
            f"                <p class='tcg-flavor'>{flavor}</p>\n"
            f"                <div class='tcg-foot'><span>Search: {q}</span><span class='tcg-read'>Open guides &#8594;</span></div>\n"
            f"              </div>\n"
            f"              <span aria-hidden='true' class='tcg-shine'></span>\n"
            f"            </a>")

guides_html = "\n".join(guide_card(i + 1, g) for i, g in enumerate(GUIDES))
script = (SRC / "script.js").read_text()

assert "]]>" not in skin and "]]>" not in script
assert "$" not in skin, "Blogger skin treats $ as a variable marker"

template = (SRC / "template.xml").read_text().replace("<!--@GUIDES@-->", guides_html)
theme = template.replace("/*@SKIN@*/", skin).replace("/*@SCRIPT@*/", script)
xml.dom.minidom.parseString(theme.encode("utf-8"))  # must be well-formed XML
DIST.mkdir(exist_ok=True)
(DIST / "oneofkind77-blogger-theme.xml").write_text(theme)

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
home_top = between("<!-- ===== Hero ===== -->", "\n    </b:if>\n\n    <!-- ===== Posts")
cta = between("<section class='cta-wrap'>", "</b:if>\n  </main>")

posts = [
    ("Money", "How to Build a Credit Score From Scratch in the U.S.", "Your first credit card, secured cards, and the habits that move your score the most."),
    ("Driving", "Getting a Driver’s License: A Step-by-Step Guide", "Documents, the written test, the road test and what to expect at the DMV."),
    ("Health", "Health Insurance Basics: Premiums, Deductibles and Copays", "The words on your insurance card, explained with real examples."),
    ("Housing", "Renting Your First Apartment", "Applications, credit checks, security deposits and reading a lease."),
    ("Culture", "Tipping in America: Who, When and How Much", "Restaurants, delivery, haircuts and hotels — a simple cheat sheet."),
    ("Work", "Understanding Your First U.S. Paycheck", "Federal and state taxes, Social Security, Medicare and benefits deductions."),
]
cards = "".join(f"""<article class='tcg reveal'><div class='tcg-inner'><div class='tcg-top'><span class='tcg-stage'>Blog Post</span><span class='tcg-no'>No. 000</span></div>
<div class='tcg-head'><h2 class='tcg-name'><a href='post.html'>{t}</a></h2><span aria-hidden='true' class='energy'></span></div>
<a class='tcg-art' href='post.html' tabindex='-1'><span class='tcg-art-in'><span aria-hidden='true' class='tcg-art-star'>&#9733;</span></span></a>
<div class='tcg-strip'><a class='tcg-type' href='#'>{l}</a> &#183; <time>September {20 - i}, 2026</time></div>
<div class='tcg-move'><span aria-hidden='true' class='cost'><i></i></span><p class='tcg-text'>{e}</p></div>
<div class='tcg-foot'><a class='tcg-read' href='post.html'>Read guide &#8594;</a><span class='tcg-rarity' aria-hidden='true'>&#9733;</span></div></div>
<span aria-hidden='true' class='tcg-shine'></span></article>""" for i, (l, t, e) in enumerate(posts))
grid = f"<div class='post-grid'>{cards}</div><div class='blog-pager' id='blog-pager'><a class='blog-pager-older-link' href='#'>More posts</a></div>"
labels = "".join(f"<li><a class='label-name' href='#'>{n}<span class='label-count'>{c}</span></a></li>" for n, c in [("Cars & Driving", 4), ("Culture", 7), ("Health", 5), ("Housing", 6), ("Money", 8), ("Work", 3)])
popular = "".join(f"<article class='post'><div class='post-content'><a class='post-image-link' href='post.html'><img class='post-thumb' alt='' src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 3 2%22%3E%3Crect width=%223%22 height=%222%22 fill=%22%232b3e6b%22/%3E%3C/svg%3E'></a><h3 class='post-title'><a href='post.html'>{t}</a></h3></div></article>" for _, t, _ in posts[:4])
topics = f"""<section class='section section-paper home-only' id='topics'><div class='container topics-grid'>
<div class='topics section'><div class='widget Label'><h3 class='title'>Browse by topic</h3><div class='widget-content list-label-widget-content'><ul>{labels}</ul></div></div></div>
<div class='popular section'><div class='widget PopularPosts'><h3 class='title'>Most read</h3><div class='widget-content popular-posts'><div role='feed'>{popular}</div></div></div></div>
</div></section>"""

latest = "<div class='section-head reveal latest-head' id='latest'><p class='eyebrow'>Fresh on the blog</p><h2>Latest posts</h2></div>"
index_html = (head.replace("{title}", "Preview – Home") + "<body class='is-home'>" + render(header, "", "") + "<main id='main-content'>"
    + render(home_top, "", "") + f"<div class='posts-zone'><div class='container main-wrap'>{latest}{grid}</div></div>" + topics + cta + "</main>" + render(footer, "", "")
    + f"<script>{script}</script></body></html>")

article = """<p>Moving to the United States means learning a new vocabulary of money. Your <strong>credit score</strong> follows you everywhere — from renting an apartment to buying a car — and when you first arrive, you don't have one at all.</p>
<h2>What a credit score actually measures</h2>
<p>A credit score is a three-digit number, usually between 300 and 850, that estimates how likely you are to repay borrowed money. Lenders, landlords and even some employers use it.</p>
<ul><li><strong>Payment history</strong> — paying on time, every time.</li><li><strong>Credit utilization</strong> — how much of your limit you use.</li><li><strong>Length of history</strong> — how long your accounts have been open.</li></ul>
<blockquote>Start small, pay in full every month, and let time do the rest.</blockquote>
<h2>Step 1: Open a secured credit card</h2>
<p>A secured card works like a regular credit card, but you put down a deposit first. Use it for one small bill each month and pay it off in full.</p>
<h3>Quick checklist</h3>
<ol><li>Get a Social Security Number or ITIN.</li><li>Open a checking account.</li><li>Apply for a secured card.</li></ol>
<hr><p>Have a question about credit? Leave it in the comments below.</p>"""
post_main = f"""<div class='posts-zone'><div class='container main-wrap'><article class='post-single'><header class='post-hero'><p class='eyebrow'><a href='#'>Money</a></p>
<h1 class='post-title entry-title'>How to Build a Credit Score From Scratch in the U.S.</h1><p class='post-meta'>By One of Kind 77 &#183; <time>September 20, 2026</time></p></header>
<div aria-hidden='true' class='stripe'></div><div class='post-body entry-content'>{article}</div>
<p class='post-tags'><a href='#'>#Money</a><a href='#'>#Credit</a><a href='#'>#Newcomers</a></p></article>
<section class='comments' id='comments'><h3 class='title'>2 comments</h3><div class='comment-thread'><ol><li class='comment'><div class='comment-header'><cite class='user'><a href='#'>Min</a></cite><span class='datetime'><a href='#'>September 21, 2026</a></span></div><p class='comment-content'>This was so helpful, thank you!</p><span class='comment-actions'><a href='#'>Reply</a></span></li></ol></div></section>
<div class='blog-pager' id='blog-pager'><a class='blog-pager-newer-link' href='#'>Newer post</a><a class='blog-pager-older-link' href='#'>Older post</a></div></div></div>"""
post_html = (head.replace("{title}", "Preview – Post") + "<body class='is-single'>" + render(header, "", "") + "<main id='main-content'>" + post_main + "</main>"
    + render(footer, "", "") + f"<script>{script}</script></body></html>")

(ROOT / "preview").mkdir(exist_ok=True)
(ROOT / "preview" / "index.html").write_text(index_html)
(ROOT / "preview" / "post.html").write_text(post_html)
print("built", DIST / "oneofkind77-blogger-theme.xml", f"{len(theme) // 1024} KB")
