export interface UserMetadata {
	error: any[];
	results: Results;
}

interface Results {
	USER: User;
	SETTING_LANG: string;
	SETTING_LOCALE: string;
	DIRECTION: string;
	SESSION_ID: string;
	USER_TOKEN: string;
	PLAYLIST_WELCOME_ID: string;
	OFFER_ID: number;
	OFFER_NAME: string;
	OFFER_ELIGIBILITIES: any[];
	COUNTRY: string;
	COUNTRY_CATEGORY: string;
	MIN_LEGAL_AGE: number;
	FAMILY_KIDS_AGE: number;
	SERVER_TIMESTAMP: number;
	PLAYER_TOKEN: string;
	checkForm: string;
	FROM_ONBOARDING: string;
	CUSTO: string;
	SETTING_REFERER_UPLOAD: string;
	REG_FLOW: string[];
	LOGIN_FLOW: string[];
	__DZR_GATEKEEPS__: { [key: string]: boolean };
	thirdParty: ThirdParty;
	URL_MEDIA: string;
	GAIN: Gain;
}

interface Gain {
	TARGET: string;
	ADS: string;
}

interface User {
	USER_ID: number;
	USER_PICTURE: string;
	INSCRIPTION_DATE: string;
	TRY_AND_BUY: TryAndBuy;
	PARTNERS: string;
	TOOLBAR: any[];
	OPTIONS: Options;
	AUDIO_SETTINGS: AudioSettings;
	SETTING: Setting;
	LASTFM: Entrypoints;
	TWITTER: Entrypoints;
	FACEBOOK: Facebook;
	GOOGLEPLUS: Entrypoints;
	FAVORITE_TAG: number;
	ABTEST: { [key: string]: Abtest };
	MULTI_ACCOUNT: MultiAccount;
	ONBOARDING_MODAL: boolean;
	ADS_OFFER: string;
	ENTRYPOINTS: Entrypoints;
	ADS_TEST_FORMAT: string;
	NEW_USER: boolean;
	CONSENT_STRING: any[];
	RECOMMENDATION_COUNTRY: string;
	CAN_BE_CONVERTED_TO_INDEPENDENT: boolean;
	IS_FREEMIUM_COUNTRY: number;
	EXPLICIT_CONTENT_LEVEL: string;
	EXPLICIT_CONTENT_LEVELS_AVAILABLE: string[];
	CAN_EDIT_EXPLICIT_CONTENT_LEVEL: boolean;
	BLOG_NAME: string;
	FIRSTNAME: string;
	LASTNAME: string;
	USER_GENDER: string;
	USER_AGE: string;
	EMAIL: string;
	DEVICES_COUNT: number;
	HAS_UPNEXT: boolean;
	LOVEDTRACKS_ID: string;
	OPTINS: Optins;
}

interface Abtest {
	id: string;
	option: string;
	behaviour: string;
}

interface AudioSettings {
	default_preset: string;
	default_download_on_mobile_network: boolean;
	presets: Preset[];
	connected_device_streaming_preset: string;
}

interface Preset {
	mobile_download: string;
	mobile_streaming: string;
	wifi_download: string;
	wifi_streaming: string;
	id: string;
	title: string;
	description: string;
}

interface Entrypoints {}

interface Facebook {
	UID: string;
}

interface MultiAccount {
	ENABLED: boolean;
	ACTIVE: boolean;
	CHILD_COUNT: null;
	MAX_CHILDREN: number;
	PARENT: null;
	IS_KID: boolean;
	IS_SUB_ACCOUNT: boolean;
}

interface Optins {
	channel: ChannelElement[];
	group: ChannelElement[];
	optin: Optin[];
}

interface ChannelElement {
	name: string;
	label: string;
	description: string;
}

interface Optin {
	name: string;
	label: string;
	description: string;
	channel: OptinChannel;
	group: Group;
	channels_requiring_validation: any[];
}

interface OptinChannel {
	optin_push?: boolean;
	optin_sms?: boolean;
	optin_mail?: boolean;
	optin_whatsapp?: boolean;
}

export enum Group {
	Extras = "extras",
	Music = "music",
	Podcasts = "podcasts"
}

interface Options {
	mobile_preview: boolean;
	mobile_radio: boolean;
	mobile_streaming: boolean;
	mobile_streaming_duration: number;
	mobile_offline: boolean;
	mobile_sound_quality: SoundQuality;
	default_download_on_mobile_network: boolean;
	mobile_hq: boolean;
	mobile_lossless: boolean;
	tablet_sound_quality: SoundQuality;
	audio_quality_default_preset: string;
	web_preview: boolean;
	web_radio: boolean;
	web_streaming: boolean;
	web_streaming_duration: number;
	web_offline: boolean;
	web_hq: boolean;
	web_lossless: boolean;
	web_sound_quality: SoundQuality;
	license_token: string;
	expiration_timestamp: number;
	license_country: string;
	ads_display: boolean;
	ads_audio: boolean;
	dj: boolean;
	nb_devices: string;
	multi_account: boolean;
	multi_account_max_allowed: number;
	radio_skips: number;
	too_many_devices: boolean;
	business: boolean;
	business_mod: boolean;
	business_box_owner: boolean;
	business_box_manager: boolean;
	business_box: boolean;
	business_no_right: boolean;
	allow_subscription: boolean;
	allow_trial_mobile: string;
	timestamp: number;
	can_subscribe: boolean;
	can_subscribe_family: boolean;
	show_subscription_section: boolean;
	streaming_group: string;
	queuelist_edition: boolean;
	web_streaming_used: number;
	ads: boolean;
}

interface SoundQuality {
	low: boolean;
	standard: boolean;
	high: boolean;
	lossless: boolean;
	reality: boolean;
}

interface Setting {
	newsletter: Newsletter;
	global: Global;
	site: Site;
	optin_mail: OptinInappClass;
	optin_push: OptinInappClass;
	optin_inapp: OptinInappClass;
	optin_sms: OptinInappClass;
	notification_mail: NotificationM;
	notification_mobile: NotificationM;
	adjust: Adjust;
	twitter: GoogleClass;
	facebook: GoogleClass;
	google: GoogleClass;
	beta_user: BetaUser;
	tips: Tips;
	audio_quality_settings: AudioQualitySettings;
	ads: Ads;
	webviews: Webviews;
}

interface Adjust {
	registration_date: number;
	devicesInfo: DevicesInfo;
	d0_stream: string;
	d7_stream: string;
}

interface DevicesInfo {
	"68678cf1-aeaf-4a4b-bb59-f66c0152d261": The68678Cf1Aeaf4A4BBb59F66C0152D261;
	"0469b06a-5831-44fe-a832-983eebc7fc3a": The0469B06A583144FeA832983Eebc7Fc3A;
	"2b2fd73f92b73a2784a81681923d4e69": The2B2Fd73F92B73A2784A81681923D4E69;
}

interface The0469B06A583144FeA832983Eebc7Fc3A {
	identifier_type: string;
}

interface The2B2Fd73F92B73A2784A81681923D4E69 {
	identifier_type: string;
	platform: string;
	device_identifier: string;
	device_identifier_type: string;
}

interface The68678Cf1Aeaf4A4BBb59F66C0152D261 {
	identifier_type: string;
	has_adid: string;
}

interface Ads {
	test_format: boolean;
	force_adsource: string;
	force_mediation: string;
}

interface AudioQualitySettings {
	preset: string;
	download_on_mobile_network: boolean;
	connected_device_streaming_preset: boolean;
}

interface BetaUser {
	ios: boolean;
	android: boolean;
	windowsphone: boolean;
	windows: boolean;
}

interface GoogleClass {
	share_comment: boolean;
	share_favourite: boolean;
	share_loved: boolean;
	share_listen?: boolean;
	share_share: boolean;
	country_store?: boolean;
}

interface Global {
	language: string;
	social: boolean;
	popup_unload: boolean;
	filter_explicit_lyrics: boolean;
	is_kid: boolean;
	has_up_next: boolean;
	dark_mode: string;
	onboarding_progress: number;
	cookie_consent_string: string;
	has_root_consent: number;
	happy_hour: string;
	recommendation_country: string;
	has_joined_family: boolean;
	explicit_level_forced: boolean;
	onboarding: boolean;
	has_already_tried_premium: boolean;
}

interface Newsletter {
	editor: boolean;
	talk: boolean;
	special_offer: boolean;
	event: boolean;
	game: boolean;
	panel: boolean;
}

interface NotificationM {
	artist_new_release: boolean;
	share: boolean;
	friend_follow: boolean;
	playlist_comment: boolean;
	playlist_follow: boolean;
	new_message: boolean;
	artist_status: boolean;
}

interface OptinInappClass {
	update: number;
	special_offer: number;
	social: number;
	event: number;
	third_party: number;
	survey: number;
}

interface Site {
	version: string;
	livebar_state: string;
	livebar_tab: string;
	push_mobile: number;
	howto_step: number;
	edito_tag: number;
	display_confirm_discovery: number;
	player_normalize: boolean;
	player_hq: boolean;
	player_audio_quality: string;
	player_repeat: number;
	cast_audio_quality: string;
}

interface Tips {
	player: boolean;
	flow: boolean;
	add_to_library: boolean;
	lyrics: number;
	up_next: boolean;
}

interface Webviews {
	domain: boolean;
}

interface TryAndBuy {
	AVAILABLE: boolean;
	ACTIVE: string;
	DATE_START: string;
	DATE_END: string;
	PLATEFORM: string;
	DAYS_LEFT_MOB: number;
}

interface ThirdParty {
	facebook: ThirdPartyFacebook;
	googleplus: Googleplus;
	braze: Braze;
}

interface Braze {
	apiKey: string;
	isAvailable: boolean;
}

interface ThirdPartyFacebook {
	appData: FacebookAppData;
	lang: string;
}

interface FacebookAppData {
	id: number;
	namespace: string;
	scope: string;
	version: string;
	channel: string;
}

interface Googleplus {
	appData: GoogleplusAppData;
}

interface GoogleplusAppData {
	client_id: string;
	client_key: string;
	name: string;
	scope: string;
	redirect_uri: string;
	access_type: string;
	cookie_policy: string;
	request_visible_actions: string;
	version: string;
}
