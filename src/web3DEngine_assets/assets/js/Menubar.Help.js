/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Deploy' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	// Source code

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Source code' );
	// option.onClick( function () {

	// 	window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )

	// } );
	// options.add( option );

	// About

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'About' );
	// option.onClick( function () {

	// 	window.open( 'http://threejs.org', '_blank' );

	// } );
	// options.add( option );


	// Publish
	var NUMBER_PRECISION = 6;
	function parseNumber( key, value ) {
		return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;
	}
	var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594
	function save( blob, filename ) {
		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();
	}

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Deploy to IC' );
	option.onClick( function () {
		var signInFlag = checkSignIn()
		if(!signInFlag) {
			showSignIn()
			return
		}
		var r=confirm("Are you sure to deploy it?");
		if (r!=true)
		{
			return
		}

		$.dialog({
			autoClose : 2000,
			titleText : 'Wait a Minute',
			contentHtml : '<div style="width:70%;padding:15px;margin:0 auto;text-align:center;">Deploying ...</div>'
		});

		let randomNameText = randomName(3)
	
		function buildFile(content,fileName,fileType) {
			let blobContent = []
			blobContent.push(content)
			let blob = new Blob(blobContent, {type: "text/plain;charset=utf-8"})
			return new File([blob], fileName, {type: fileType})
		}

		var output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		var vr = output.project.vr;

		output = JSON.stringify( output, parseNumber, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		// upload app.json
		let JSONfile = buildFile(output,"app.json","application/json")
		console.log(JSONfile)
		uploadToIC(JSONfile,randomNameText,0)

		var manager = new THREE.LoadingManager( function () {
		} );
		var loader = new THREE.FileLoader( manager );

		loader.load( 'js/libs/app.js', function ( content ) {
			let file = buildFile(content,"js/app.js","text/javascript")
			uploadToIC(file,randomNameText,0)
		} );
		loader.load( '../build/three.min.js', function ( content ) {
			let file = buildFile(content,'js/three.min.js',"text/javascript")
			uploadToIC(file,randomNameText,0)
		} );

		if ( vr ) {
			loader.load( '../examples/js/controls/VRControls.js', function ( content ) {
				let file = buildFile(content,'js/VRControls.js',"text/javascript")
				uploadToIC(file,randomNameText,0)
			} );
			loader.load( '../examples/js/effects/VREffect.js', function ( content ) {
				let file = buildFile(content,'js/VREffect.js',"text/javascript")
				uploadToIC(file,randomNameText,0)
			} );
			loader.load( '../examples/js/WebVR.js', function ( content ) {
				let file = buildFile(content,'js/WebVR.js',"text/javascript")
				uploadToIC(file,randomNameText,0)
			} );
		}

		loader.load( 'js/libs/app/index.html', function ( content ) {
			var includes = [];
			if ( vr ) {
				includes.push( '<script src="js/VRControls.js"></script>' );
				includes.push( '<script src="js/VREffect.js"></script>' );
				includes.push( '<script src="js/WebVR.js"></script>' );
			}
			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );
			
			let file = buildFile(content,"index.html","text/html")
			uploadToIC(file,randomNameText,1)
		} );
	} );
	options.add( option );


	// About

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'My Assets' );
	option.onClick( function () {
		getUserAssets()
	} );
	options.add( option );


	return container;

};
