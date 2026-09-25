<?php
/**
 * 404 page.
 *
 * @package Korea_The_Long_Way
 */

get_header();
?>
<header class="page-hero">
	<div class="container narrow">
		<p class="eyebrow">404</p>
		<h1 class="page-title"><?php esc_html_e( 'This road doesn’t lead anywhere.', 'korea-the-long-way' ); ?></h1>
		<p class="page-intro"><?php esc_html_e( 'The page you were looking for has moved or never existed. Try a search, or head back home.', 'korea-the-long-way' ); ?></p>
		<?php get_search_form(); ?>
		<p><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to home', 'korea-the-long-way' ); ?></a></p>
	</div>
</header>
<div class="dancheong" aria-hidden="true"></div>
<?php
get_footer();
