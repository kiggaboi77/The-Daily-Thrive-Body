<?php
/**
 * Korea, The Long Way — theme functions.
 *
 * @package Korea_The_Long_Way
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KTLW_VERSION', '1.1.1' );

/**
 * Theme setup.
 */
function ktlw_setup() {
	load_theme_textdomain( 'korea-the-long-way', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);
	// Optional: upload a photo under Appearance → Customize → Header Image to replace the hero illustration.
	add_theme_support(
		'custom-header',
		array(
			'width'       => 2400,
			'height'      => 1350,
			'flex-width'  => true,
			'flex-height' => true,
			'header-text' => false,
		)
	);

	add_image_size( 'ktlw-card', 800, 520, true );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'korea-the-long-way' ),
			'footer'  => __( 'Footer Menu', 'korea-the-long-way' ),
		)
	);

	add_editor_style( 'assets/css/editor.css' );
}
add_action( 'after_setup_theme', 'ktlw_setup' );

/**
 * Content width for embeds.
 */
function ktlw_content_width() {
	$GLOBALS['content_width'] = 760;
}
add_action( 'after_setup_theme', 'ktlw_content_width', 0 );

/**
 * Styles and scripts.
 */
function ktlw_enqueue() {
	wp_enqueue_style(
		'ktlw-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&family=Nanum+Myeongjo:wght@700;800&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'ktlw-style', get_stylesheet_uri(), array( 'ktlw-fonts' ), KTLW_VERSION );
	wp_enqueue_script( 'ktlw-main', get_template_directory_uri() . '/assets/js/main.js', array(), KTLW_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'ktlw_enqueue' );

/**
 * Mark JS as available before first paint so scroll-reveal content doesn't flash.
 */
function ktlw_js_class() {
	echo "<script>document.documentElement.classList.add('js');</script>
";
}
add_action( 'wp_head', 'ktlw_js_class', 1 );

/**
 * Preconnect to Google Fonts.
 */
function ktlw_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' );
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'ktlw_resource_hints', 10, 2 );

/**
 * Widget areas (e.g. for AdSense ad units).
 */
function ktlw_widgets_init() {
	$shared = array(
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	);
	register_sidebar(
		array_merge(
			$shared,
			array(
				'name'        => __( 'After Post Content', 'korea-the-long-way' ),
				'id'          => 'after-post',
				'description' => __( 'Shown below each article. A good spot for an ad unit or related links.', 'korea-the-long-way' ),
			)
		)
	);
	register_sidebar(
		array_merge(
			$shared,
			array(
				'name'        => __( 'Footer', 'korea-the-long-way' ),
				'id'          => 'footer',
				'description' => __( 'Shown above the footer links on every page.', 'korea-the-long-way' ),
			)
		)
	);
}
add_action( 'widgets_init', 'ktlw_widgets_init' );

/**
 * Body classes: the front page has a full-screen hero under a transparent header.
 */
function ktlw_body_class( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'has-hero';
	}
	return $classes;
}
add_filter( 'body_class', 'ktlw_body_class' );

/**
 * Shorter excerpts with a clean ending.
 */
add_filter( 'excerpt_length', fn() => 28 );
add_filter( 'excerpt_more', fn() => '…' );

/**
 * URL of a page by slug, or '' if it doesn't exist.
 */
function ktlw_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	return ( $page && 'publish' === $page->post_status ) ? get_permalink( $page ) : '';
}

/**
 * The blog's main category: the one with the most posts.
 * "Uncategorized" is only used when it is the only category with posts.
 */
function ktlw_main_category() {
	$cats = get_categories(
		array(
			'orderby'    => 'count',
			'order'      => 'DESC',
			'hide_empty' => true,
			'number'     => 5,
		)
	);
	$default = (int) get_option( 'default_category' );
	foreach ( $cats as $cat ) {
		if ( (int) $cat->term_id !== $default ) {
			return $cat;
		}
	}
	return $cats ? $cats[0] : null;
}

/**
 * Link to the blog/posts listing.
 */
function ktlw_posts_url() {
	$page_for_posts = (int) get_option( 'page_for_posts' );
	if ( $page_for_posts ) {
		return get_permalink( $page_for_posts );
	}
	return home_url( '/' );
}

/**
 * Estimated reading time in minutes.
 */
function ktlw_reading_time( $post = null ) {
	$words = str_word_count( wp_strip_all_tags( get_post_field( 'post_content', $post ) ) );
	return max( 1, (int) round( $words / 220 ) );
}

/**
 * Fallback menus when no menu is assigned.
 */
function ktlw_primary_fallback() {
	$items = array(
		ktlw_page_url( 'about' )      => __( 'About', 'korea-the-long-way' ),
		ktlw_posts_url()              => __( 'Articles', 'korea-the-long-way' ),
		ktlw_page_url( 'contact-us' ) => __( 'Contact Us', 'korea-the-long-way' ),
	);
	echo '<ul class="menu">';
	if ( is_front_page() ) {
		echo '<li><a href="#why">' . esc_html__( 'Why the Long Way', 'korea-the-long-way' ) . '</a></li>';
	}
	foreach ( $items as $url => $label ) {
		if ( $url ) {
			echo '<li><a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
		}
	}
	echo '</ul>';
}

function ktlw_footer_fallback() {
	$items = array(
		'about'          => __( 'About', 'korea-the-long-way' ),
		'contact-us'     => __( 'Contact Us', 'korea-the-long-way' ),
		'privacy-policy' => __( 'Privacy Policy', 'korea-the-long-way' ),
	);
	echo '<ul class="menu">';
	foreach ( $items as $slug => $label ) {
		$url = ktlw_page_url( $slug );
		if ( $url ) {
			echo '<li><a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
		}
	}
	echo '</ul>';
}

/**
 * Brand mark used in header and footer.
 */
function ktlw_brand() {
	?>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand" rel="home">
		<span class="seal" aria-hidden="true">길</span>
		<span class="brand-text">
			<span class="brand-kicker"><?php esc_html_e( 'Welcome to', 'korea-the-long-way' ); ?></span>
			<span class="brand-name">Korea, <em>The Long Way</em></span>
		</span>
		<span class="screen-reader-text"><?php bloginfo( 'name' ); ?></span>
	</a>
	<?php
}

require get_template_directory() . '/inc/default-pages.php';
