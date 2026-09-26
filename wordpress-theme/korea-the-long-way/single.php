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

		<div class="post-layout">
		<aside class="post-toc" aria-label="<?php esc_attr_e( 'On this page', 'korea-the-long-way' ); ?>" hidden>
			<p class="aside-title"><?php esc_html_e( 'On this page', 'korea-the-long-way' ); ?></p>
			<div class="toc-progress" aria-hidden="true"><span></span></div>
			<ol class="toc-list"></ol>
		</aside>

		<div class="entry-wrap post-main">
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

		<aside class="post-aside" aria-label="<?php esc_attr_e( 'More from the blog', 'korea-the-long-way' ); ?>">
			<?php if ( is_active_sidebar( 'post-sidebar' ) ) : ?>
				<div class="aside-widgets"><?php dynamic_sidebar( 'post-sidebar' ); ?></div>
			<?php endif; ?>

			<?php
			$ktlw_cats    = wp_get_post_categories( get_the_ID() );
			$ktlw_related = new WP_Query(
				array(
					'posts_per_page'      => 4,
					'post__not_in'        => array( get_the_ID() ),
					'category__in'        => $ktlw_cats,
					'ignore_sticky_posts' => true,
					'no_found_rows'       => true,
				)
			);
			if ( $ktlw_related->have_posts() ) :
				?>
				<div class="aside-box">
					<p class="aside-title"><?php esc_html_e( 'More stories', 'korea-the-long-way' ); ?></p>
					<ul class="aside-posts">
						<?php
						while ( $ktlw_related->have_posts() ) :
							$ktlw_related->the_post();
							?>
							<li>
								<a href="<?php the_permalink(); ?>">
									<span class="aside-thumb">
										<?php if ( has_post_thumbnail() ) : ?>
											<?php the_post_thumbnail( 'thumbnail', array( 'alt' => '' ) ); ?>
										<?php else : ?>
											<span aria-hidden="true">길</span>
										<?php endif; ?>
									</span>
									<span class="aside-post-title"><?php the_title(); ?></span>
								</a>
							</li>
						<?php endwhile; ?>
					</ul>
				</div>
				<?php
				wp_reset_postdata();
			endif;
			?>

			<div class="aside-box aside-word">
				<p class="aside-title"><?php esc_html_e( 'Korean word of the day', 'korea-the-long-way' ); ?></p>
				<p class="aside-word-roman" data-word="roman">gam sa ham ni da</p>
				<p class="aside-word-meaning" data-word="meaning">Thank you</p>
				<p class="aside-word-note" data-word="note">Formal and polite — safe with anyone.</p>
			</div>
		</aside>
		</div>
	</article>
	<?php
endwhile;

get_footer();
