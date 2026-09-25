<?php
/**
 * Creates the About, Contact Us and Privacy Policy pages when the theme is activated.
 * Existing pages with the same slug are never modified.
 *
 * @package Korea_The_Long_Way
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ktlw_default_pages() {
	return array(
		'about'          => __( 'About', 'korea-the-long-way' ),
		'contact-us'     => __( 'Contact Us', 'korea-the-long-way' ),
		'privacy-policy' => __( 'Privacy Policy', 'korea-the-long-way' ),
	);
}

function ktlw_create_default_pages() {
	foreach ( ktlw_default_pages() as $slug => $title ) {
		$existing = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $existing && 'trash' !== $existing->post_status ) {
			// WordPress ships a draft "Privacy Policy" page — fill it only if it is still the untouched default draft.
			if ( 'privacy-policy' === $slug && 'draft' === $existing->post_status && (int) get_option( 'wp_page_for_privacy_policy' ) === (int) $existing->ID && $existing->post_modified === $existing->post_date ) {
				wp_update_post(
					array(
						'ID'           => $existing->ID,
						'post_content' => ktlw_page_content( $slug ),
						'post_status'  => 'publish',
					)
				);
			}
			continue;
		}

		$id = wp_insert_post(
			array(
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => ktlw_page_content( $slug ),
				'post_status'  => 'publish',
				'post_type'    => 'page',
			)
		);

		if ( $id && ! is_wp_error( $id ) && 'privacy-policy' === $slug ) {
			update_option( 'wp_page_for_privacy_policy', $id );
		}
	}
}
add_action( 'after_switch_theme', 'ktlw_create_default_pages' );

/**
 * The front page is a designed landing page, so articles need their own listing page.
 * Only applies when the site still uses the default "Your latest posts" homepage setting.
 */
function ktlw_setup_reading_pages() {
	if ( 'posts' !== get_option( 'show_on_front' ) ) {
		return;
	}
	$home     = ktlw_ensure_page( 'home', __( 'Home', 'korea-the-long-way' ) );
	$articles = ktlw_ensure_page( 'articles', __( 'Articles', 'korea-the-long-way' ) );
	if ( $home && $articles ) {
		update_option( 'page_on_front', $home );
		update_option( 'page_for_posts', $articles );
		update_option( 'show_on_front', 'page' );
	}
}
add_action( 'after_switch_theme', 'ktlw_setup_reading_pages' );

function ktlw_ensure_page( $slug, $title ) {
	$page = get_page_by_path( $slug, OBJECT, 'page' );
	if ( $page && 'trash' !== $page->post_status ) {
		return (int) $page->ID;
	}
	$id = wp_insert_post(
		array(
			'post_title'  => $title,
			'post_name'   => $slug,
			'post_status' => 'publish',
			'post_type'   => 'page',
		)
	);
	return is_wp_error( $id ) ? 0 : (int) $id;
}

function ktlw_page_content( $slug ) {
	$file = get_template_directory() . '/inc/pages/' . $slug . '.html';
	return file_exists( $file ) ? (string) file_get_contents( $file ) : '';
}
