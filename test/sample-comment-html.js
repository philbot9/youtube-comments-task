const cheerio = require('cheerio')

const COMMENT_ID = 'z12vvvxaryjywra0h234jdcg5p24zbvol04'
const COMMENT_USER = 'the_comment_username'
const COMMENT_FROMNOW = '1 month ago'
const COMMENT_TEXT = 'This is the actual comment text.'
const COMMENT_LIKES = 3

const REPLY_ID = '1475411087107188'
const REPLY_USER = 'the_reply_username'
const REPLY_FROMNOW = '1 week ago'
const REPLY_TEXT = 'This is the actual reply text.'
const REPLY_LIKES = 1

module.exports = {
  sampleComment,
  COMMENT_ID,
  COMMENT_USER,
  COMMENT_FROMNOW,
  COMMENT_TEXT,
  COMMENT_LIKES,
  REPLY_ID,
  REPLY_USER,
  REPLY_FROMNOW,
  REPLY_TEXT,
REPLY_LIKES}

function sampleComment (params = {}) {
  const { id = COMMENT_ID, user = COMMENT_USER, fromNow = COMMENT_FROMNOW, text = COMMENT_TEXT, likes = COMMENT_LIKES, replies = 0, repliesToken = '' } = params

  return [
    commentTop({id, user, fromNow, text, likes}),
    buildReplies(id, replies, repliesToken),
    commentBottom()
  ].join('')
}

function commentTop ({ id, user, fromNow, text, likes }) {
  return `
<section class="comment-thread-renderer" data-visibility-tracking="CKQBEMJ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-priority="0">
<div class="comment-renderer" data-visibility-tracking="CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-cid="${id}">
<a href="/channel/UCjp-_6mlFkVBZlG1nvKJ6bg" class="yt-uix-sessionlink  g-hovercard     " data-ytid="UCjp-_6mlFkVBZlG1nvKJ6bg" data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-RcMiXUAfT18/AAAAAAAAAAI/AAAAAAAAAAA/amHviLmRIqE/s48-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="48" tabindex="0" height="48" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</a>

    <div id="comment-renderer-edit-z12vvvxaryjywra0h234jdcg5p24zbvol04" class="comment-simplebox-edit" data-editable-content-text="" data-image-src="" data-video-id="">
    </div>
<div class="comment-renderer-content"><div class="comment-renderer-header"><a href="/channel/UCjp-_6mlFkVBZlG1nvKJ6bg" class="yt-uix-sessionlink comment-author-text g-hovercard     " data-ytid="UCjp-_6mlFkVBZlG1nvKJ6bg" data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${user}</a><span class="comment-renderer-time" tabindex="0"><a href="/watch?v=XkcGuZHPbKk&amp;lc=z12vvvxaryjywra0h234jdcg5p24zbvol04" class=" yt-uix-sessionlink     " data-sessionlink="itct=CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF">${fromNow}</a></span></div><div class="comment-renderer-text" tabindex="0" role="article">
<div class="comment-renderer-text-content">${text}</div><div class="comment-text-toggle hid"><div class="comment-text-toggle-link read-more"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Read more
</span></button></div><div class="comment-text-toggle-link show-less hid"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Show less
</span></button></div></div></div>

<div class="comment-renderer-footer" data-vote-status="INDIFFERENT"><div class="comment-action-buttons-toolbar">

    <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger" type="button" onclick=";return false;" data-simplebox-id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04" data-simplebox-sessionlink="itct=CLIBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-simplebox-event="replycreated" data-simplebox-target="/comment_service_ajax?action_create_comment_reply=1" data-simplebox-params="EgtYa2NHdVpIUGJLayIjejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqAggAMAA%3D" data-simplebox-label="Reply"><span class="yt-uix-button-content">Reply</span></button>

    <span class="comment-renderer-like-count off">${likes}</span>
    <span class="comment-renderer-like-count on">${(likes + 1)}</span>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";return false;" aria-label="Like" data-action-type="like" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CLMBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAUQAhojejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqC1hrY0d1WkhQYktrMAA4AEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D"></button>

      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";return false;" aria-label="Dislike" data-action-type="dislike" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-url="/comment_service_ajax?action_perform_comment_action=1" data-sessionlink="itct=CLEBEPBbIhMIivG8hf2M0AIVB3hOCh3PWgpF" data-action="CAQQAhojejEydnZ2eGFyeWp5d3JhMGgyMzRqZGNnNXAyNHpidm9sMDQqC1hrY0d1WkhQYktrMAA4AEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D"></button>

  <div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container">

      <div class="yt-uix-menu yt-uix-menu-flipped hide-until-delayloaded">  <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-pressed="false" role="button" aria-haspopup="true" aria-label="Action menu."><span class="yt-uix-button-arrow yt-sprite"></span></button>
<div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu">  <ul>
      <li role="menuitem">
                <div class="service-endpoint-action-container hid">
    </div>

    <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  report-form-modal-renderer" data-innertube-clicktracking="CK0BELZ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-params="GiN6MTJ2dnZ4YXJ5anl3cmEwaDIzNGpkY2c1cDI0emJ2b2wwNCgBMhNGZWRlcmljbyBDYXZhbGx1Y2NpOlEIARACGiN6MTJ2dnZ4YXJ5anl3cmEwaDIzNGpkY2c1cDI0emJ2b2wwNCoLWGtjR3VaSFBiS2swAEoVMTA5NjA4NzA1MTYzMTA4NTA4NzI1UAA%3D" data-url="/flag_service_ajax?action_get_report_form=1">
    <span class="yt-ui-menu-item-label">Report spam or abuse</span>
  </button>

      </li>
  </ul>
</div></div>
  </div>
</div><div class="comment-renderer-replybox" id="comment-simplebox-reply-z12vvvxaryjywra0h234jdcg5p24zbvol04">
  <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">
    <span class="yt-thumb-square">
      <span class="yt-thumb-clip">

  <img data-ytimg="1" src="https://yt3.ggpht.com/-PrmuKbjhU_Y/AAAAAAAAAAI/AAAAAAAAAAA/M6JCmj2zJ0c/s108-c-k-no-mo-rj-c0xffffff/photo.jpg" onload=";__ytRIL(this)" width="32" tabindex="0" height="32" role="img" alt="${user}">

        <span class="vertical-align"></span>
      </span>
    </span>
  </span>
</div></div></div></div><div class="comment-replies-renderer" data-visibility-tracking="CKUBEL51IhMIivG8hf2M0AIVB3hOCh3PWgpF">`
}

function buildReplies (commentId, replies, repliesToken) {
  return (!replies || replies <= 0)
    ? ''
    : `
    <div class="yt-uix-expander yt-uix-expander-collapsed comment-replies-renderer-header" tabindex="0">
    <div class="yt-uix-expander-collapsed-body">

    <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-replies-renderer-paginator comment-replies-renderer-expander-down yt-uix-button-link" type="button" onclick=";return false;" aria-label="View all 6 replies" data-uix-load-more-post="true" data-uix-load-more-href="/comment_service_ajax?action_get_comment_replies=1" data-uix-load-more-target-id="comment-replies-renderer-z13kfn15oumthvdi404cirmattv0dz14mdk"
      data-uix-load-more-post-body="page_token=${repliesToken}"><span class="yt-uix-button-content">  <span class="load-more-loading hid">
      <span class="yt-spinner">
      <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>

Loading...
  </span>

  </span>
  <span class="load-more-text">
    View all ${replies} replies
  </span>
</span></button>

      <div class="yt-uix-expander-head comment-replies-renderer-expander-down comment-replies-renderer-view hid" tabindex="0">
        View all 6 replies
      </div>

    </div>
    <div id="comment-replies-renderer-z13kfn15oumthvdi404cirmattv0dz14mdk" class="yt-uix-expander-body comment-replies-renderer-pages">

      <div class="yt-uix-expander-head comment-replies-renderer-expander-up comment-replies-renderer-hide" tabindex="0">
        Hide replies
      </div>
    </div>
  </div>`
}

function commentBottom () {
  return '</div></section>'
}
