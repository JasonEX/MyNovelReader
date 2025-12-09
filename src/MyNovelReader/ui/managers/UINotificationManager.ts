import type { IUINotificationManager, UINoticeElement } from '../types';

class UINotificationManager implements IUINotificationManager {
  noticeDivto?: number;

  notice(htmlText: string, duration = 1666): UINoticeElement {
    const $noticeDiv = $('#alert');

    clearTimeout(this.noticeDivto);
    $noticeDiv.find('p').html(htmlText);
    $noticeDiv.fadeIn('fast');

    this.noticeDivto = window.setTimeout(() => {
      $noticeDiv.fadeOut(500);
    }, duration);

    return $noticeDiv;
  }
}

export default UINotificationManager;
