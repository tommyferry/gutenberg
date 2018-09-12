/**
 * External dependencies
 */
import { get, noop } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	IconButton,
	FormFileUpload,
	Placeholder,
	DropZone,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import MediaUpload from '../media-upload';
import { mediaUpload } from '../../utils/';

class MediaPlaceholder extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			src: '',
			isURLInputExpanded: false,
		};
		this.onChangeSrc = this.onChangeSrc.bind( this );
		this.onSubmitSrc = this.onSubmitSrc.bind( this );
		this.onUpload = this.onUpload.bind( this );
		this.onFilesUpload = this.onFilesUpload.bind( this );
		this.toggleURLInputVisibility = this.toggleURLInputVisibility.bind( this );
	}

	componentDidMount() {
		this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
	}

	componentDidUpdate( prevProps ) {
		if ( get( prevProps.value, [ 'src' ], '' ) !== get( this.props.value, [ 'src' ], '' ) ) {
			this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
		}
	}

	onChangeSrc( event ) {
		this.setState( {
			src: event.target.value,
		} );
	}

	onSubmitSrc( event ) {
		event.preventDefault();
		if ( this.state.src && this.props.onSelectURL ) {
			this.props.onSelectURL( this.state.src );
		}
	}

	onUpload( event ) {
		this.onFilesUpload( event.target.files );
	}

	onFilesUpload( files ) {
		const { onSelect, type, multiple, onError } = this.props;
		const setMedia = multiple ? onSelect : ( [ media ] ) => onSelect( media );
		mediaUpload( {
			allowedType: type,
			filesList: files,
			onFileChange: setMedia,
			onError,
		} );
	}

	toggleURLInputVisibility() {
		this.setState( { isURLInputExpanded: ! this.state.isURLInputExpanded } );
	}

	render() {
		const {
			type,
			accept,
			icon,
			className,
			labels,
			onSelect,
			value = {},
			onSelectURL,
			onHTMLDrop = noop,
			multiple = false,
			notices,
		} = this.props;

		const {
			isURLInputExpanded,
		} = this.state;

		return (
			<Placeholder
				icon={ icon }
				label={ labels.title }
				// translators: %s: media name label e.g: "an audio","an image", "a video"
				instructions={ sprintf( __( 'Drag %s, upload a new one or select a file from your library.' ), labels.name ) }
				className={ classnames( 'editor-media-placeholder', className ) }
				notices={ notices }
			>
				<DropZone
					onFilesDrop={ this.onFilesUpload }
					onHTMLDrop={ onHTMLDrop }
				/>
				<FormFileUpload
					isLarge
					className="editor-media-placeholder__upload-button"
					onChange={ this.onUpload }
					accept={ accept }
					multiple={ multiple }
				>
					{ __( 'Upload' ) }
				</FormFileUpload>
				<MediaUpload
					gallery={ multiple && type === 'image' }
					multiple={ multiple }
					onSelect={ onSelect }
					type={ type }
					value={ value.id }
					render={ ( { open } ) => (
						<Button isLarge onClick={ open }>
							{ __( 'Media Library' ) }
						</Button>
					) }
				/>
				{ onSelectURL && (
					<div className="editor-media-placeholder__url-input-expandable-section">
						<IconButton
							isLarge
							className="editor-media-placeholder__url-input-expandable-button"
							icon={ isURLInputExpanded ? 'arrow-up' : 'arrow-down' }
							onClick={ this.toggleURLInputVisibility }
							isToggled={ isURLInputExpanded }
							aria-expanded={ isURLInputExpanded }
						>
							{ ! isURLInputExpanded ? __( 'Enter URL' ) : null }
						</IconButton>
						{ isURLInputExpanded &&
							<form
								className="editor-media-placeholder__url-input-form"
								onSubmit={ this.onSubmitSrc }
							>
								<input
									type="url"
									className="components-placeholder__input editor-media-placeholder__url-input"
									aria-label={ labels.title }
									placeholder={ __( 'Enter URL here…' ) }
									onChange={ this.onChangeSrc }
									value={ this.state.src }
								/>
								<Button
									isLarge
									type="submit">
									{ __( 'Use URL' ) }
								</Button>
							</form>
						}
					</div>
				) }
			</Placeholder>
		);
	}
}

export default MediaPlaceholder;
