
"use strict";


$( document ).ready( function() {



  // Ajoute target="_blank" aux liens externes.
  ( function() {
    var internal = location.host.replace( "www.", "" );
    internal = new RegExp( internal, "i" );
    var a = document.getElementsByTagName( 'a' );
    for( var i = 0; i < a.length; i++ ) {
      var href = a[ i ].host;
      if( !internal.test( href ) ) {
        a[ i ].setAttribute( 'target', '_blank' );
      }
    }
  })();



  // Navigation page suivante ou précédente avec les flèches
  // gauche-droite du clavier (Mousetrap, https://craig.is/killing/mice)
  // et le balayage gauche-droite de l’écran (jQuery Mobile, https://jquerymobile.com/).
  // !! Il faut discriminer les écrans tactiles des souris.
  // !! L’évènement “swipe” est activé lors d’un “pinch” si les dimensions de
  // la page sont fixées dans la balise <meta> "viewport". Il faut donc laisser
  // la possibilité de zoomer avec deux doigts.
  ( function() {

    var navigate_to_page = function( e, button_class ) {
      var target_page = $( button_class ).first().attr( 'href' );
      window.location.href = target_page;
    }

    Mousetrap.bind( 'left',       function( e ) { navigate_to_page( e, '.bouton-prec'    ); });
    Mousetrap.bind( 'esc',        function( e ) { navigate_to_page( e, '.bouton-accueil' ); });
    Mousetrap.bind( 'right',      function( e ) { navigate_to_page( e, '.bouton-suiv'    ); });

    $( 'body' ).on( 'mousedown',  function( e ) { disable_swipe( e ); });
    $( 'body' ).on( 'touchstart', function( e ) { enable_swipe( e );  });

    function disable_swipe( e ) {
      $( 'body' ).off( 'swiperight swipeleft' );
    }
    function enable_swipe( e ) {
      $( 'body' ).on( 'swiperight', function( e ) { navigate_to_page( e, '.bouton-prec' ); });
      $( 'body' ).on( 'swipeleft',  function( e ) { navigate_to_page( e, '.bouton-suiv' ); });
    }
  })();



  // Formulaire de contact.
  ( function() {
    var $contactForm = $( '#contact-form' );
    $contactForm.submit( function(e) {
      e.preventDefault();
      var $form_status = $( '#form-status' );
      $form_status.removeClass( "hidden" );

      // Vérifie que tous les champs sont remplis
      var form_email_length   = $( '#form-email' ).val().length;
      var form_nom_length     = $( '#form-nom' ).val().length;
      var form_message_length = $( '#form-message' ).val().length;
      if( form_email_length == 0 || form_nom_length == 0 || form_message_length == 0 ) {
        $form_status.html( '<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Veuillez remplir tous les champs <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span></div>' );
        return;
      }

      $.ajax({
        url: $( '#contact-form' ).attr( "action" ),
        method: 'POST',
        data: $( this ).serialize(),
        dataType: 'json',
        beforeSend: function() {
          $form_status.html( '<div class="alert alert-info" role="alert">Envoi du message</div>' );
        },
        success: function(data) {
          $form_status.html( '<div class="alert alert-success" role="alert">Message envoyé, merci !</div>' );
          $( '#form-submit-button' ).prop( "disabled", true );
          $( '#form-email' ).val( '' );
          $( '#form-nom' ).val( '' );
          $( '#form-message' ).val( '' );
        },
        error: function(err) {
          $form_status.html( '<div class="alert alert-danger" role="alert">Il y a eu une erreur !</div>' );
        }
      });
    });
  })();



  // Liste des liens des catégories sur la page de liens
  ( function() {
    function creeListeDeLiens() {
      var stringCategories =
      $( 'h2' )
        .map(function() {
          $( this ).addClass( 'link-target' );
          var listString = '<a href="#' + this.id + '">' + $( this ).html() + '</a>';
          return listString;
        })
        .get()
        .join( '<br/>' );
      $( '#categories' ).html( '<p>' + stringCategories + '</p>' );
    }
    if( $( '#categories' ).length > 0 ) {
      creeListeDeLiens();
    }
  })();



});