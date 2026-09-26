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
	var today = Math.floor( Date.now() / 86400000 ) % words.length;

	var card = document.getElementById( 'word-card' );
	if ( card ) {
		var i = today;
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

	// Article sidebar: the same word of the day.
	var mini = document.querySelector( '.aside-word' );
	if ( mini ) {
		mini.querySelector( '[data-word="roman"]' ).textContent = words[ today ][ 0 ];
		mini.querySelector( '[data-word="meaning"]' ).textContent = words[ today ][ 1 ];
		mini.querySelector( '[data-word="note"]' ).textContent = words[ today ][ 2 ];
	}

	// Article: "On this page" contents built from the H2 headings, with reading progress.
	var toc = document.querySelector( '.post-toc' );
	var body = document.querySelector( '.entry-content' );
	if ( toc && body ) {
		var heads = body.querySelectorAll( 'h2' );
		if ( heads.length >= 2 ) {
			var list = toc.querySelector( '.toc-list' );
			var links = [];
			heads.forEach( function ( h, n ) {
				if ( ! h.id ) {
					h.id = 'section-' + ( n + 1 ) + '-' + h.textContent.toLowerCase().replace( /[^a-z0-9]+/g, '-' ).replace( /^-|-$/g, '' ).slice( 0, 40 );
				}
				var li = document.createElement( 'li' );
				var a = document.createElement( 'a' );
				a.href = '#' + h.id;
				a.textContent = h.textContent;
				li.appendChild( a );
				list.appendChild( li );
				links.push( a );
			} );
			toc.hidden = false;

			var bar = toc.querySelector( '.toc-progress span' );
			var onScroll = function () {
				var r = body.getBoundingClientRect();
				var total = r.height - window.innerHeight * 0.5;
				var done = Math.min( 1, Math.max( 0, ( window.innerHeight * 0.3 - r.top ) / ( total > 0 ? total : 1 ) ) );
				bar.style.width = ( done * 100 ).toFixed( 1 ) + '%';
				var current = 0;
				heads.forEach( function ( h, n ) {
					if ( h.getBoundingClientRect().top < window.innerHeight * 0.35 ) {
						current = n;
					}
				} );
				links.forEach( function ( a, n ) {
					a.classList.toggle( 'active', n === current );
				} );
			};
			window.addEventListener( 'scroll', onScroll, { passive: true } );
			onScroll();
		}
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
