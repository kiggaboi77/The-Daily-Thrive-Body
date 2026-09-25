<?php
/**
 * Article card used in archives, search and the blog index.
 *
 * @package Korea_The_Long_Way
 */

$ktlw_cat = get_the_category();
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'card' ); ?>>
	<a class="card-link" href="<?php the_permalink(); ?>">
		<span class="card-thumb">
			<?php if ( has_post_thumbnail() ) : ?>
				<?php the_post_thumbnail( 'ktlw-card', array( 'alt' => '' ) ); ?>
			<?php else : ?>
				<span class="card-thumb-fallback" aria-hidden="true">길</span>
			<?php endif; ?>
		</span>
		<span class="card-body">
			<span class="stop-tag"><?php echo esc_html( $ktlw_cat ? $ktlw_cat[0]->name : __( 'Article', 'korea-the-long-way' ) ); ?></span>
			<h2 class="card-title"><?php the_title(); ?></h2>
			<span class="card-excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></span>
			<span class="card-meta"><?php echo esc_html( get_the_date() ); ?> &middot; <?php echo esc_html( sprintf( /* translators: %d: minutes */ __( '%d min read', 'korea-the-long-way' ), ktlw_reading_time() ) ); ?></span>
		</span>
	</a>
</article>
