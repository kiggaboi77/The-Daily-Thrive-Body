<?php
/**
 * Main template: blog index and fallback for all other views.
 *
 * @package Korea_The_Long_Way
 */

get_header();
?>

<header class="page-hero">
	<div class="container">
		<p class="eyebrow">
			<?php
			if ( is_search() ) {
				esc_html_e( 'Search', 'korea-the-long-way' );
			} elseif ( is_archive() ) {
				esc_html_e( 'Archive', 'korea-the-long-way' );
			} else {
				esc_html_e( 'The journey so far', 'korea-the-long-way' );
			}
			?>
		</p>
		<h1 class="page-title">
			<?php
			if ( is_search() ) {
				/* translators: %s: search query */
				printf( esc_html__( 'Results for “%s”', 'korea-the-long-way' ), esc_html( get_search_query() ) );
			} elseif ( is_archive() ) {
				echo esc_html( wp_strip_all_tags( get_the_archive_title() ) );
			} else {
				esc_html_e( 'All articles', 'korea-the-long-way' );
			}
			?>
		</h1>
		<?php if ( is_archive() && get_the_archive_description() ) : ?>
			<div class="page-intro"><?php the_archive_description(); ?></div>
		<?php endif; ?>
		<?php if ( is_search() ) : ?>
			<?php get_search_form(); ?>
		<?php endif; ?>
	</div>
</header>
<div class="dancheong" aria-hidden="true"></div>

<section class="section section-tight">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="cards">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/card' );
				endwhile;
				?>
			</div>
			<?php
			the_posts_pagination(
				array(
					'mid_size'  => 1,
					'prev_text' => '&larr; ' . __( 'Newer', 'korea-the-long-way' ),
					'next_text' => __( 'Older', 'korea-the-long-way' ) . ' &rarr;',
				)
			);
			?>
		<?php else : ?>
			<div class="empty">
				<p><?php esc_html_e( 'Nothing found here yet. Try a different search.', 'korea-the-long-way' ); ?></p>
				<?php get_search_form(); ?>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
