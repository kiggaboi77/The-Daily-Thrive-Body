<?php
/**
 * Static pages (About, Contact Us, Privacy Policy, …).
 *
 * @package Korea_The_Long_Way
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
		<header class="page-hero">
			<div class="container narrow">
				<p class="eyebrow"><?php esc_html_e( 'Welcome to Korea, The Long Way', 'korea-the-long-way' ); ?></p>
				<h1 class="page-title"><?php the_title(); ?></h1>
			</div>
		</header>
		<div class="dancheong" aria-hidden="true"></div>
		<div class="container narrow entry-wrap">
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="entry-thumb"><?php the_post_thumbnail( 'large' ); ?></figure>
			<?php endif; ?>
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
			<?php
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</div>
	</article>
	<?php
endwhile;

get_footer();
