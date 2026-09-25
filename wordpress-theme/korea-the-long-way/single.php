<?php
/**
 * Single article.
 *
 * @package Korea_The_Long_Way
 */

get_header();

while ( have_posts() ) :
	the_post();
	$ktlw_cat = get_the_category();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
		<header class="page-hero entry-hero">
			<div class="container narrow">
				<?php if ( $ktlw_cat ) : ?>
					<p class="eyebrow"><a href="<?php echo esc_url( get_category_link( $ktlw_cat[0] ) ); ?>"><?php echo esc_html( $ktlw_cat[0]->name ); ?></a></p>
				<?php endif; ?>
				<h1 class="page-title"><?php the_title(); ?></h1>
				<p class="entry-meta">
					<?php if ( get_the_author() ) : ?>
						<?php esc_html_e( 'By', 'korea-the-long-way' ); ?> <?php the_author(); ?> &middot;
					<?php endif; ?>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
					<?php if ( get_the_modified_date( 'Y-m-d' ) !== get_the_date( 'Y-m-d' ) ) : ?>
						&middot; <?php esc_html_e( 'Updated', 'korea-the-long-way' ); ?> <time datetime="<?php echo esc_attr( get_the_modified_date( 'c' ) ); ?>"><?php echo esc_html( get_the_modified_date() ); ?></time>
					<?php endif; ?>
					&middot; <?php echo esc_html( sprintf( /* translators: %d: minutes */ __( '%d min read', 'korea-the-long-way' ), ktlw_reading_time() ) ); ?>
				</p>
			</div>
		</header>
		<div class="dancheong" aria-hidden="true"></div>

		<div class="container narrow entry-wrap">
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="entry-thumb"><?php the_post_thumbnail( 'large' ); ?></figure>
			<?php endif; ?>

			<div class="entry-content">
				<?php
				the_content();
				wp_link_pages(
					array(
						'before' => '<nav class="page-links">' . esc_html__( 'Pages:', 'korea-the-long-way' ),
						'after'  => '</nav>',
					)
				);
				?>
			</div>

			<?php $ktlw_tags = get_the_tags(); ?>
			<?php if ( $ktlw_tags ) : ?>
				<p class="entry-tags">
					<?php foreach ( $ktlw_tags as $ktlw_tag ) : ?>
						<a href="<?php echo esc_url( get_tag_link( $ktlw_tag ) ); ?>">#<?php echo esc_html( $ktlw_tag->name ); ?></a>
					<?php endforeach; ?>
				</p>
			<?php endif; ?>

			<?php if ( is_active_sidebar( 'after-post' ) ) : ?>
				<aside class="after-post"><?php dynamic_sidebar( 'after-post' ); ?></aside>
			<?php endif; ?>

			<aside class="author-box">
				<span class="seal seal-lg" aria-hidden="true">길</span>
				<div>
					<p class="author-name"><?php esc_html_e( 'Written by kiggaboi77', 'korea-the-long-way' ); ?></p>
					<p><?php esc_html_e( 'Born and raised in Korea, living in the United States for about 30 years. Sharing Korean culture from a personal perspective, one story at a time.', 'korea-the-long-way' ); ?></p>
				</div>
			</aside>

			<?php
			the_post_navigation(
				array(
					'prev_text' => '<span class="nav-label">' . esc_html__( 'Previous stop', 'korea-the-long-way' ) . '</span><span class="nav-title">%title</span>',
					'next_text' => '<span class="nav-label">' . esc_html__( 'Next stop', 'korea-the-long-way' ) . '</span><span class="nav-title">%title</span>',
				)
			);

			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</div>
	</article>
	<?php
endwhile;

get_footer();
