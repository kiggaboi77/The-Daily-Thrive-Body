<?php
/**
 * Front page.
 *
 * @package Korea_The_Long_Way
 */

get_header();

$ktlw_hero = get_header_image() ? get_header_image() : get_template_directory_uri() . '/assets/img/hero.svg';
$ktlw_chapters = array(
	array( 'etiquette', 'Etiquette', '예절', __( 'Etiquette & Traditions', 'korea-the-long-way' ), __( 'Shoes, bowing, pouring drinks and respecting elders.', 'korea-the-long-way' ), '<path d="M6 44c4-6 10-8 18-8h14c6 0 10-3 14-8 2 6 0 12-6 16-4 3-10 4-16 4H14c-4 0-7-1-8-4Z"/><path d="M14 36c2-5 6-8 12-8"/><path d="M10 54h46"/>' ),
	array( 'food', 'Korean food', '음식', __( 'Food & Dining', 'korea-the-long-way' ), __( 'The table, the side dishes and the story in each bowl.', 'korea-the-long-way' ), '<path d="M8 32h40c0 11-9 18-20 18S8 43 8 32Z"/><path d="M18 50h20"/><path d="M20 24c-2-4 2-6 0-10M28 24c-2-4 2-6 0-10M36 24c-2-4 2-6 0-10"/><path d="M52 12v36M58 12l-2 36"/>' ),
	array( 'k-pop-k-drama', 'K-Drama', '한류', __( 'K-POP & K-Drama', 'korea-the-long-way' ), __( 'The culture behind the songs and scenes you love.', 'korea-the-long-way' ), '<rect x="6" y="12" width="52" height="34" rx="3"/><path d="M27 22v14l12-7Z"/><path d="M22 54h20M32 46v8"/>' ),
	array( 'holidays', 'Chuseok', '명절', __( 'Holidays', 'korea-the-long-way' ), __( 'Chuseok, Seollal and the traditions families keep.', 'korea-the-long-way' ), '<circle cx="40" cy="20" r="12"/><path d="M8 50c0-8 6-13 13-13s13 5 13 13Z"/><path d="M30 54c0-7 5-11 11-11s11 4 11 11Z"/>' ),
	array( 'language', 'Korean language', '한글', __( 'Language', 'korea-the-long-way' ), __( 'Everyday words and expressions, and what they reveal.', 'korea-the-long-way' ), '<rect x="8" y="8" width="48" height="48" rx="4"/><path d="M18 20h14v14M40 16v32M40 30h8"/><path d="M18 44h14"/>' ),
	array( 'korea-and-america', 'Korean American', '두 나라', __( 'Korea & America', 'korea-the-long-way' ), __( 'The cultural differences that surprise both sides.', 'korea-the-long-way' ), '<circle cx="24" cy="32" r="16"/><circle cx="40" cy="32" r="16"/>' ),
);
?>

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
			<p class="eyebrow"><?php esc_html_e( 'Chapters', 'korea-the-long-way' ); ?></p>
			<h2><?php esc_html_e( 'Roads into Korean life', 'korea-the-long-way' ); ?></h2>
		</div>
		<div class="chapters">
			<?php foreach ( $ktlw_chapters as $ktlw_ch ) : ?>
				<a class="chapter reveal" href="<?php echo esc_url( ktlw_chapter_url( $ktlw_ch[0], $ktlw_ch[1] ) ); ?>">
					<svg viewBox="0 0 64 64" aria-hidden="true"><?php echo $ktlw_ch[5]; // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG markup. ?></svg>
					<span class="hangul" aria-hidden="true"><?php echo esc_html( $ktlw_ch[2] ); ?></span>
					<h3><?php echo esc_html( $ktlw_ch[3] ); ?></h3>
					<p><?php echo esc_html( $ktlw_ch[4] ); ?></p>
				</a>
			<?php endforeach; ?>
		</div>
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
