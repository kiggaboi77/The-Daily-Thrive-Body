<?php
/**
 * Site header.
 *
 * @package Korea_The_Long_Way
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'korea-the-long-way' ); ?></a>

<header class="site-header<?php echo is_front_page() ? '' : ' solid'; ?>" id="site-header">
	<div class="container nav">
		<?php ktlw_brand(); ?>
		<button class="nav-toggle" aria-label="<?php esc_attr_e( 'Open menu', 'korea-the-long-way' ); ?>" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>
		<nav class="nav-links" id="site-nav" aria-label="<?php esc_attr_e( 'Primary', 'korea-the-long-way' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'depth'          => 1,
					'fallback_cb'    => 'ktlw_primary_fallback',
				)
			);
			?>
		</nav>
	</div>
</header>

<main id="content" class="site-main">
