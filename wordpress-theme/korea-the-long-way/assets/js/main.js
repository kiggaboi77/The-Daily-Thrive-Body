( function () {
	document.documentElement.classList.add( 'js' );

	// Header turns solid once the hero is scrolled past (front page only).
	var header = document.getElementById( 'site-header' );
	if ( header && document.body.classList.contains( 'has-hero' ) ) {
		var onScroll = function () {
			header.classList.toggle( 'scrolled', window.scrollY > 60 );
		};
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();
	}

	// Mobile navigation.
	var toggle = document.querySelector( '.nav-toggle' );
	var nav = document.getElementById( 'site-nav' );
	if ( toggle && nav ) {
		toggle.addEventListener( 'click', function () {
			var open = nav.classList.toggle( 'open' );
			toggle.setAttribute( 'aria-expanded', open );
		} );
		nav.addEventListener( 'click', function ( e ) {
			if ( e.target.tagName !== 'A' ) return;
			nav.classList.remove( 'open' );
			toggle.setAttribute( 'aria-expanded', false );
		} );
	}

	// Korean word of the day — meaning + romanization with spaced syllables.
	var card = document.getElementById( 'word-card' );
	if ( card ) {
		var words = [
			[ 'an nyeong ha se yo', 'Hello', 'The polite, everyday greeting.' ],
			[ 'gam sa ham ni da', 'Thank you', 'Formal and polite — safe with anyone.' ],
			[ 'hyeon gwan', 'Entryway', 'The spot by the door where shoes come off.' ],
			[ 'on dol', 'Underfloor heating', 'The warm floors at the heart of Korean homes.' ],
			[ 'sil nae hwa', 'Indoor slippers', 'Worn inside schools and many homes.' ],
			[ 'jal meok get seum ni da', 'I will eat well', 'Said before a meal — like “thanks for the food”.' ],
			[ 'geon bae', 'Cheers', 'Raise your glass!' ],
			[ 'jeong', 'Deep affection', 'The warm bond that grows between people over time.' ],
			[ 'song pyeon', 'Half-moon rice cake', 'The classic Chuseok treat.' ],
			[ 'mi yeok guk', 'Seaweed soup', 'Traditionally eaten on birthdays.' ],
			[ 'dae bak', 'Awesome!', 'Heard constantly in K-Dramas and variety shows.' ],
			[ 'hwa i ting', 'You can do it!', 'A cheer of encouragement, from “fighting”.' ]
		];
		var i = Math.floor( Date.now() / 86400000 ) % words.length;
		var show = function () {
			card.classList.remove( 'flipped' );
			document.getElementById( 'word-roman' ).textContent = words[ i ][ 0 ];
			document.getElementById( 'word-meaning' ).textContent = words[ i ][ 1 ];
			document.getElementById( 'word-note' ).textContent = words[ i ][ 2 ];
		};
		card.addEventListener( 'click', function () {
			card.classList.toggle( 'flipped' );
		} );
		document.getElementById( 'next-word' ).addEventListener( 'click', function () {
			i = ( i + 1 ) % words.length;
			show();
		} );
		show();
	}

	// Reveal sections as they scroll into view.
	var items = document.querySelectorAll( '.reveal' );
	if ( 'IntersectionObserver' in window ) {
		var io = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( en ) {
				if ( en.isIntersecting ) {
					en.target.classList.add( 'in' );
					io.unobserve( en.target );
				}
			} );
		}, { threshold: 0.12 } );
		items.forEach( function ( el, n ) {
			el.style.transitionDelay = ( n % 4 ) * 80 + 'ms';
			io.observe( el );
		} );
	} else {
		items.forEach( function ( el ) { el.classList.add( 'in' ); } );
	}
} )();
