<?php
/**
 * Search form.
 *
 * @package Korea_The_Long_Way
 */

$ktlw_id = wp_unique_id( 'search-' );
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $ktlw_id ); ?>"><?php esc_html_e( 'Search for:', 'korea-the-long-way' ); ?></label>
	<input type="search" id="<?php echo esc_attr( $ktlw_id ); ?>" class="search-field" placeholder="<?php esc_attr_e( 'Search articles…', 'korea-the-long-way' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
	<button type="submit" class="btn"><?php esc_html_e( 'Search', 'korea-the-long-way' ); ?></button>
</form>
