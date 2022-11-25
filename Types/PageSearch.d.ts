export interface PageSearchResults {
	error: any[];
	results: Results;
}

export interface Results {
	QUERY: string;
	FUZZINNESS: boolean;
	AUTOCORRECT: boolean;
	ORDER: string[];
	TOP_RESULT: any[];
	ARTIST: Album;
	ALBUM: Album;
	TRACK: Track;
	PLAYLIST: Album;
	RADIO: Album;
	USER: Album;
	SHOW: Album;
	CHANNEL: Channel;
	LIVESTREAM: Album;
	EPISODE: Album;
	LYRICS: Album;
}

export interface Album {
	data: ALBUMDatum[];
	count: number;
	total: number;
	filtered_count: number;
	filtered_items: number[];
	next: number;
}

export interface ALBUMDatum {
	ALB_ID: string;
	ALB_TITLE: string;
	ALB_PICTURE: string;
	ARTISTS: PurpleARTIST[];
	AVAILABLE: boolean;
	VERSION: string;
	ART_ID: string;
	ART_NAME: string;
	EXPLICIT_ALBUM_CONTENT: ExplicitContent;
	PHYSICAL_RELEASE_DATE: string;
	TYPE: string;
	SUBTYPES: Subtypes;
	ARTIST_IS_DUMMY: boolean;
	NUMBER_TRACK: string;
	__TYPE__: string;
}

export interface PurpleARTIST {
	ART_ID: string;
	ROLE_ID: string;
	ARTISTS_ALBUMS_ORDER: string;
	ART_NAME: string;
	ART_PICTURE: string;
	RANK: string;
	LOCALES: any[] | { [key: string]: Locale };
	ARTIST_IS_DUMMY: boolean;
	__TYPE__: ArtistType;
}

export interface Locale {
	name: string;
}

export enum ArtistType {
	Artist = "artist"
}

export interface ExplicitContent {
	EXPLICIT_LYRICS_STATUS: number;
	EXPLICIT_COVER_STATUS: number;
}

export interface Subtypes {
	isStudio: boolean;
	isLive: boolean;
	isCompilation: boolean;
	isKaraoke: boolean;
}

export interface Channel {
	data: any[];
	count: number;
	total: number;
}

export interface Track {
	data: TRACKDatum[];
	count: number;
	total: number;
	filtered_count: number;
	filtered_items: number[];
	next: number;
}

export interface TRACKDatum {
	SNG_ID: string;
	PRODUCT_TRACK_ID: string;
	UPLOAD_ID: number;
	SNG_TITLE: string;
	ART_ID: string;
	PROVIDER_ID: string;
	ART_NAME: string;
	ARTIST_IS_DUMMY: boolean;
	ARTISTS: FluffyARTIST[];
	ALB_ID: string;
	ALB_TITLE: string;
	TYPE: number;
	MD5_ORIGIN: string;
	VIDEO: boolean;
	DURATION: string;
	ALB_PICTURE: string;
	ART_PICTURE: string;
	RANK_SNG: string;
	FILESIZE_AAC_64: string;
	FILESIZE_MP3_64: string;
	FILESIZE_MP3_128: string;
	FILESIZE_MP3_256: string;
	FILESIZE_MP3_320: string;
	FILESIZE_FLAC: string;
	FILESIZE: string;
	GAIN?: string;
	MEDIA_VERSION: string;
	DISK_NUMBER: string;
	TRACK_NUMBER: string;
	TRACK_TOKEN: string;
	TRACK_TOKEN_EXPIRE: number;
	MEDIA: Media[];
	EXPLICIT_LYRICS: string;
	RIGHTS: Rights;
	ISRC: string;
	HIERARCHICAL_TITLE: string;
	SNG_CONTRIBUTORS: SngContributors;
	LYRICS_ID: number;
	EXPLICIT_TRACK_CONTENT: ExplicitContent;
	DATE_START: string;
	DATE_START_PREMIUM: string;
	S_MOD: number;
	S_PREMIUM: number;
	STATUS: number;
	HAS_LYRICS: boolean;
	__TYPE__: DatumTYPE;
	VERSION?: string;
}

export interface FluffyARTIST {
	ART_ID: string;
	ROLE_ID: string;
	ARTISTS_SONGS_ORDER: string;
	ART_NAME: string;
	ARTIST_IS_DUMMY: boolean;
	ART_PICTURE: string;
	RANK: string;
	LOCALES: any[];
	__TYPE__: ArtistType;
}

export interface Media {
	TYPE: Type;
	HREF: string;
}

export enum Type {
	Preview = "preview"
}

export interface Rights {
	STREAM_ADS_AVAILABLE: boolean;
	STREAM_ADS: string;
	STREAM_SUB_AVAILABLE: boolean;
	STREAM_SUB: string;
}

export interface SngContributors {
	mainartist?: string[];
	mixer?: string[];
	composer: string[];
	lyricist?: string[];
	musicpublisher?: string[];
	main_artist?: string[];
	author?: string[];
	writer?: string[];
}

export enum DatumTYPE {
	Song = "song"
}
