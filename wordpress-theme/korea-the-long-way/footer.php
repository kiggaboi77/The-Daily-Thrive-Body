<?php
/**
 * Site footer.
 *
 * @package Korea_The_Long_Way
 */
?>
</main>

<footer class="site-footer">
	<div class="dancheong" aria-hidden="true"></div>
	<div class="container footer-inner">
		<?php if ( is_active_sidebar( 'footer' ) ) : ?>
			<div class="footer-widgets"><?php dynamic_sidebar( 'footer' ); ?></div>
		<?php endif; ?>
		<?php ktlw_brand(); ?>
		<p class="footer-tagline"><?php esc_html_e( 'Discover Korea, one story at a time.', 'korea-the-long-way' ); ?></p>
		<nav class="footer-links" aria-label="<?php esc_attr_e( 'Footer', 'korea-the-long-way' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'depth'          => 1,
					'fallback_cb'    => 'ktlw_footer_fallback',
				)
			);
			?>
		</nav>
		<p class="small">&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?> &middot; kiggaboi77.com</p>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
