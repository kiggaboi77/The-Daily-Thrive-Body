<?php
/**
 * Front page.
 *
 * @package Korea_The_Long_Way
 */

get_header();

$ktlw_hero = get_header_image() ? get_header_image() : get_template_directory_uri() . '/assets/img/hero.svg';
$ktlw_topics = array(
	__( 'Etiquette & Traditions', 'korea-the-long-way' ),
	__( 'Food & Dining', 'korea-the-long-way' ),
	__( 'K-POP & K-Drama', 'korea-the-long-way' ),
	__( 'Holidays', 'korea-the-long-way' ),
	__( 'Language', 'korea-the-long-way' ),
	__( 'Korea & America', 'korea-the-long-way' ),
);
$ktlw_cat = ktlw_main_category();?>

<section class="hero">
	<img class="hero-art" src="<?php echo esc_url( $ktlw_hero ); ?>" alt="<?php esc_attr_e( 'A moonlit Korean landscape: a hanok with glowing paper windows, a pine tree, and a long road winding through misty mountains', 'korea-the-long-way' ); ?>" fetchpriority="high">
	<div class="hero-vertical" aria-hidden="true">먼 길</div>
	<div class="container hero-content">
		<p class="eyebrow light"><?php esc_html_e( 'Welcome to', 'korea-the-long-way' ); ?> &middot; 먼 길 &middot; meon gil</p>
		<h1>Korea,<br><em>the long way.</em></h1>
		<p class="lead"><?php esc_html_e( 'Look beyond the surface. The stories, traditions and everyday life behind Korean culture — from etiquette and food to K-POP and K-Drama — explained simply, one story at a time.', 'korea-the-long-way' ); ?></p>
		<div class="hero-actions">
			<a href="#journey" class="btn btn-light"><?php esc_html_e( 'Start the journey', 'korea-the-long-way' ); ?></a>
			<a href="#why" class="btn btn-outline-light"><?php esc_html_e( 'Why “the long way”?', 'korea-the-long-way' ); ?></a>
		</div>
	</div>
	<a href="#why" class="scroll-cue" aria-label="<?php esc_attr_e( 'Scroll down', 'korea-the-long-way' ); ?>"><span></span></a>
</section>

<div class="dancheong" aria-hidden="true"></div>

<section id="why" class="section">
	<div class="container why">
		<div class="why-intro reveal">
			<p class="eyebrow"><?php esc_html_e( 'Why the long way', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'The short answer is rarely the whole story.', 'korea-the-long-way' ); ?></h2>
			<p><?php echo wp_kses_post( __( 'Ask why Koreans take off their shoes indoors and you’ll usually hear “to keep the floor clean.” True — but the long way goes further: through <em>ondol</em> heated floors, centuries of sitting and sleeping on the floor, and the quiet meaning of the entryway.', 'korea-the-long-way' ) ); ?></p>
			<p><?php esc_html_e( 'Korean culture is more than what we see in K-POP, K-Drama or travel videos. This blog explores the stories and everyday customs behind it, and explains them in a simple, approachable way.', 'korea-the-long-way' ); ?></p>
		</div>
		<ol class="principles">
			<li class="reveal">
				<span class="hangul">천천히</span>
				<span class="roman">cheon cheon hi</span>
				<h3><?php esc_html_e( 'Slowly', 'korea-the-long-way' ); ?></h3>
				<p><?php esc_html_e( 'Each article takes one custom and follows it back to where it began.', 'korea-the-long-way' ); ?></p>
			</li>
			<li class="reveal">
				<span class="hangul">깊이</span>
				<span class="roman">gi pi</span>
				<h3><?php esc_html_e( 'Deeply', 'korea-the-long-way' ); ?></h3>
				<p><?php esc_html_e( 'Researched from reliable sources, and compared with other cultures so the differences make sense.', 'korea-the-long-way' ); ?></p>
			</li>
			<li class="reveal">
				<span class="hangul">진심</span>
				<span class="roman">jin sim</span>
				<h3><?php esc_html_e( 'Sincerely', 'korea-the-long-way' ); ?></h3>
				<p><?php esc_html_e( 'Born and raised in Korea, living in the United States for about 30 years — Korea explained from both sides.', 'korea-the-long-way' ); ?></p>
			</li>
		</ol>
	</div>
</section>

<section id="chapters" class="section section-paper">
	<div class="container">
		<div class="section-head reveal">
			<p class="eyebrow"><?php esc_html_e( 'The chapter', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'One road into Korean culture', 'korea-the-long-way' ); ?></h2>
		</div>
		<a class="chapter-one reveal" href="<?php echo esc_url( $ktlw_cat ? get_category_link( $ktlw_cat ) : ktlw_posts_url() ); ?>">
			<span class="hangul" aria-hidden="true">한국 문화</span>
			<span class="chapter-one-main">
				<span class="chapter-one-no">01</span>
				<h3><?php echo esc_html( $ktlw_cat ? $ktlw_cat->name : __( 'Korean Culture', 'korea-the-long-way' ) ); ?></h3>
				<p><?php esc_html_e( 'Every story on this blog lives here — the customs, food, holidays, words and everyday details that make Korea feel like Korea, explained one at a time.', 'korea-the-long-way' ); ?></p>
				<span class="chapter-one-topics">
					<?php foreach ( $ktlw_topics as $ktlw_t ) : ?>
						<span><?php echo esc_html( $ktlw_t ); ?></span>
					<?php endforeach; ?>
				</span>
			</span>
			<span class="chapter-one-side">
				<?php if ( $ktlw_cat ) : ?>
					<span class="chapter-one-count"><strong><?php echo esc_html( number_format_i18n( $ktlw_cat->count ) ); ?></strong> <?php echo esc_html( _n( 'article', 'articles', $ktlw_cat->count, 'korea-the-long-way' ) ); ?></span>
				<?php endif; ?>
				<span class="btn"><?php esc_html_e( 'Read the chapter', 'korea-the-long-way' ); ?> &rarr;</span>
			</span>
		</a>
	</div>
</section>

<section id="journey" class="section">
	<div class="container">
		<div class="section-head reveal">
			<p class="eyebrow"><?php esc_html_e( 'Latest articles', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'Stops along the way', 'korea-the-long-way' ); ?></h2>
		</div>
		<?php
		$ktlw_posts = new WP_Query(
			array(
				'posts_per_page'      => 6,
				'ignore_sticky_posts' => true,
				'no_found_rows'       => true,
			)
		);
		if ( $ktlw_posts->have_posts() ) :
			?>
			<ol class="route">
				<?php
				$ktlw_n = 0;
				while ( $ktlw_posts->have_posts() ) :
					$ktlw_posts->the_post();
					++$ktlw_n;
					$ktlw_cat = get_the_category();
					?>
					<li class="stop reveal">
						<span class="stop-marker"><?php echo esc_html( str_pad( (string) $ktlw_n, 2, '0', STR_PAD_LEFT ) ); ?></span>
						<a class="stop-card" href="<?php the_permalink(); ?>">
							<?php if ( has_post_thumbnail() ) : ?>
								<span class="stop-thumb"><?php the_post_thumbnail( 'ktlw-card', array( 'alt' => '' ) ); ?></span>
							<?php endif; ?>
							<span class="stop-body">
								<span class="stop-tag"><?php echo esc_html( $ktlw_cat ? $ktlw_cat[0]->name : __( 'Article', 'korea-the-long-way' ) ); ?> &middot; <?php echo esc_html( get_the_date() ); ?></span>
								<h3><?php the_title(); ?></h3>
								<span class="stop-excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></span>
							</span>
							<span class="stop-status"><?php esc_html_e( 'Read', 'korea-the-long-way' ); ?> &rarr;</span>
						</a>
					</li>
				<?php endwhile; ?>
			</ol>
			<p class="route-more"><a class="btn" href="<?php echo esc_url( ktlw_posts_url() ); ?>"><?php esc_html_e( 'See all articles', 'korea-the-long-way' ); ?></a></p>
			<?php
			wp_reset_postdata();
		else :
			?>
			<p class="empty"><?php esc_html_e( 'The first stories are on their way.', 'korea-the-long-way' ); ?></p>
		<?php endif; ?>
	</div>
</section>

<section id="vocab" class="section section-ink">
	<div class="container vocab">
		<div class="reveal">
			<p class="eyebrow light"><?php esc_html_e( 'Quick Vocab', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'Korean word of the day', 'korea-the-long-way' ); ?></h2>
			<p class="muted-light"><?php esc_html_e( 'A new word each day, written the way it sounds. Tap the card to reveal its meaning.', 'korea-the-long-way' ); ?></p>
			<button type="button" class="btn btn-outline-light" id="next-word"><?php esc_html_e( 'Another word', 'korea-the-long-way' ); ?> &rarr;</button>
		</div>
		<button type="button" class="word-card reveal" id="word-card" aria-live="polite">
			<span class="word-face word-front">
				<span class="seal seal-lg" aria-hidden="true">말</span>
				<span class="roman-lg" id="word-roman">gam sa ham ni da</span>
				<small><?php esc_html_e( 'Tap to reveal', 'korea-the-long-way' ); ?></small>
			</span>
			<span class="word-face word-back">
				<span class="meaning" id="word-meaning">Thank you</span>
				<small id="word-note">Formal and polite — safe with anyone.</small>
			</span>
		</button>
	</div>
</section>

<section id="about" class="section section-paper">
	<div class="container about reveal">
		<span class="seal seal-xl" aria-hidden="true">길</span>
		<div>
			<p class="eyebrow"><?php esc_html_e( 'About', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'Hi, I’m kiggaboi77.', 'korea-the-long-way' ); ?></h2>
			<p><?php esc_html_e( 'Born and raised in Korea and living in the United States for about 30 years, I have experienced both Korean and American cultures. Through this blog, I share Korean culture from a personal perspective and explain the little details that can make Korea easier to understand.', 'korea-the-long-way' ); ?></p>
			<?php $ktlw_about = ktlw_page_url( 'about' ); ?>
			<?php if ( $ktlw_about ) : ?>
				<a class="text-link" href="<?php echo esc_url( $ktlw_about ); ?>"><?php esc_html_e( 'More about this blog', 'korea-the-long-way' ); ?> &rarr;</a>
			<?php endif; ?>
		</div>
	</div>
</section>

<section class="cta-wrap">
	<div class="container cta reveal">
		<h2><?php esc_html_e( 'Have a question or a topic idea?', 'korea-the-long-way' ); ?></h2>
		<p><?php esc_html_e( 'Questions, suggestions, corrections and feedback are always welcome.', 'korea-the-long-way' ); ?></p>
		<?php $ktlw_contact = ktlw_page_url( 'contact-us' ); ?>
		<a class="btn" href="<?php echo esc_url( $ktlw_contact ? $ktlw_contact : 'mailto:kiggaboi77@gmail.com' ); ?>"><?php esc_html_e( 'Contact us', 'korea-the-long-way' ); ?></a>
	</div>
</section>

<?php
get_footer();
