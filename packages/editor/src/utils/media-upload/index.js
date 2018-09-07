/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { mediaUpload } from './media-upload';

/**
 * Upload a media file when the file upload button is activated.
 * Wrapper around mediaUpload() that injects the current post ID.
 *
 * @param   {Object}   $0                   Parameters object passed to the function.
 * @param   {string}   $0.allowedType       The type of media that can be uploaded, or '*' to allow all.
 * @param   {Array}    $0.filesList         List of files.
 * @param   {?number}  $0.maxUploadFileSize Maximum upload size in bytes allowed for the site.
 * @param   {Function} $0.onError           Function called when an error happens.
 * @param   {Function} $0.onFileChange      Function called each time a file or a temporary representation of the file is available.
 */
export default function( {
	allowedType,
	filesList,
	maxUploadFileSize,
	onError = noop,
	onFileChange,
} ) {
	deprecated( 'mediaDetails in object passed to onFileChange callback of wp.editor.mediaUpload', {
		version: '4.2',
		alternative: 'media_details property containing exactly the property as returned by the rest api',
	} );

	const {
		getCurrentPostId,
		getEditorSettings,
	} = select( 'core/editor' );
	const allowedMimeTypes = getEditorSettings().allowedMimeTypes;
	maxUploadFileSize = maxUploadFileSize || getEditorSettings().maxUploadFileSize;

	mediaUpload( {
		allowedType,
		filesList,
		onFileChange,
		additionalData: {
			post: getCurrentPostId(),
		},
		maxUploadFileSize,
		onError: ( { message } ) => onError( message ),
		allowedMimeTypes,
	} );
}
