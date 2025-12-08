<form id="preferences" name="preferences">
    <div id="setting_table1">
        <div class="form-row">
            <div class="row-inline">
                <label>
                    界面语言
                    <select id="lang">
                    </select>
                </label>
                <a href="https://greasyfork.org/scripts/292-my-novel-reader/feedback" target="_blank">反馈地址</a>
                <label id="quietMode" class="right" title="隐藏其他，只保留正文，适用于全屏状态下">
                    <input class="key" type="button" id="quietModeKey"/>安静模式
                </label>
            </div>
            <div class="toggle-row">
                <label for="debug" class="toggle-label">调试模式</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="debug" name="debug"/>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <div class="form-row">
            <div class="row-inline">
                <fieldset id="launch-mode" style="width: 195px; display: inline-block;">
                    <legend title="不影响 booklink.me 的启用" style="cursor: default;">启动模式</legend>
                    <input type="radio" id="launch-mode-memory" name="launch-mode" value="memory">
                    <label for="launch-mode-memory">记忆</label>
                    <input type="radio" id="launch-mode-auto" name="launch-mode" value="auto">
                    <label for="launch-mode-auto">自动</label>
                    <input type="radio" id="launch-mode-manual" name="launch-mode" value="manual">
                    <label for="launch-mode-manual">手动</label>
                </fieldset>
                <fieldset id="chinese-conversion" style="width: 195px; display: inline-block;">
                    <legend title="将小说网页文本转换为简/繁体。\n\n注意：内置的繁简转换表，词库覆盖有限，可能会有误转换，启用本功能后，如有错误转换的情形，可以使用浏览器自带的翻译功能来转换或请利用脚本的自订字词取代规则来修正。\n例如：「千里之外」，会错误转换成「千里之外」，你可以加入规则「千里之外=千里之外」来自行修正。" style="cursor: default;">繁简转换</legend>
                    <input type="radio" id="chinese-conversion-disable" name="chinese-conversion" value="disable">
                    <label for="chinese-conversion-disable">关闭</label>
                    <input type="radio" id="chinese-conversion-to-cn" name="chinese-conversion" value="to-cn">
                    <label for="chinese-conversion-to-cn">简体</label>
                    <input type="radio" id="chinese-conversion-to-tw" name="chinese-conversion" value="to-tw">
                    <label for="chinese-conversion-to-tw">繁体</label>
                </fieldset>
            </div>
        </div>
        <div class="form-row">
            <fieldset id="content-normalize">
                <legend style="cursor: default;">内容标准化</legend>
                <div class="toggle-group">
                    <div class="toggle-row">
                        <label for="enable-content-normalize" class="toggle-label" title="包含自动分段/合并、标点符号替换等功能">
                            内容标准化
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="enable-content-normalize" name="content-normalize"/>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="toggle-row">
                        <label for="merge-qoutes-content" class="toggle-label">合并双引号中的多行内容</label>
                        <label class="toggle-switch">
                            <input type="checkbox" name="content-normalize" id="merge-qoutes-content">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="form-row">
            <div class="toggle-group">
                <div class="toggle-row">
                    <label for="preload-next-page" class="toggle-label">预载下一页</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="preload-next-page" name="preload-next-page"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <label for="fastboot" class="toggle-label">快速启动</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="fastboot" name="fastboot"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row" title="booklink.me 点击的网站强制启用">
                    <label for="booklink-enable" class="toggle-label">booklink 自动启用</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="booklink-enable" name="booklink-enable"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <label for="remove-domain-line" class="toggle-label">删除含网站域名行</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="remove-domain-line" name="remove-domain-line"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="toggle-group">
                <div class="toggle-row" title="图片章节用夜间模式没法看，这个选项在启动时会自动切换到缺省皮肤">
                    <label for="pic-nightmode-check" class="toggle-label">
                        夜间模式的图片章节检测
                    </label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="pic-nightmode-check" name="pic-nightmode-check"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <label for="copyCurTitle" class="toggle-label">打开目录复制当前标题</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="copyCurTitle"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="toggle-group">
                <div class="toggle-row" title="通过快捷键切换">
                    <label for="hide-menu-list" class="toggle-label">隐藏左侧章节列表</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hide-menu-list"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <label for="hide-footer-nav" class="toggle-label">隐藏底部导航栏</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hide-footer-nav"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div class="row-inline">
                <input type="button" id="saveAsTxt" value="存为 txt（测试）" />
                <input type="button" id="speech" value="朗读" />
            </div>
        </div>
        <div class="form-row">
            <div class="row-inline">
                <label>
                    左侧导航栏切换快捷键：
                </label>
                <input class="key" type="button" id="setHideMenuListKey" />
                <div class="toggle-row" title="通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口">
                    <label for="hide-preferences-button" class="toggle-label">隐藏设置按钮</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hide-preferences-button"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <input class="key" type="button" id="openPreferencesKey"/>
            </div>
        </div>
        <div class="form-row">
            <div class="row-inline">
                <label>
                    打开朗读快捷键：
                </label>
                <input class="key" type="button" id="setOpenSpeechKey" />
            </div>
            <div class="toggle-row">
                <label for="enable-dblclick-pause" class="toggle-label">双击暂停翻页</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="enable-dblclick-pause"/>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <div class="form-row">
            <div class="row-inline">
                <label>
                    距离底部
                    <input type="textbox" id="remain-height" name="remain-height" size="5"/>
                    px 加载下一页
                </label>
            </div>
            <div class="toggle-row">
                <label for="add-nextpage-to-history" class="toggle-label">添加下一页到历史记录</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="add-nextpage-to-history"/>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <div class="form-row">
            <div class="row-inline">
                <label>
                    <select id="skin">
                    </select>
                </label>
                <label>
                    字体
                    <input type="textbox" id="font-family" style="min-width:200px;"/>
                </label>
            </div>
            <div class="row-inline">
                <label>
                    字体大小
                    <input type="textbox" id="font-size" name="font-size" size="6"/>
                </label>
                <label>
                    行高
                    <input type="textbox" id="text_line_height" size="6"/>
                </label>
                <label>
                    段高
                    <input type="textbox" id="paragraph_height" size="6"/>
                </label>
            </div>
            <div class="row-inline">
                <label>
                    行宽
                    <input type="textbox" id="content_width" size="6"/>
                </label>
            </div>
        </div>
        <div class="form-row">
            <div class="toggle-group">
                <div class="toggle-row" title="把一大块未分段的内容文本按照句号分段">
                    <label for="split_content" class="toggle-label">对一坨内容进行强制分段</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="split_content"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <label for="scroll_animate" class="toggle-label">章节直达滚动效果</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="scroll_animate"/>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="prefs_title">自定义样式</div>
            <textarea id="extra_css" class="prefs_textarea" placeholder="自定义样式"></textarea>
        </div>
    </div>
    <div id="setting_table2">
        <div class="form-row" title="详见脚本代码的 Rule.specialSite">
            <div class="prefs_title">自定义站点规则</div>
            <textarea id="custom_siteinfo" class="prefs_textarea" placeholder="自定义站点规则"></textarea>
        </div>
        <div class="form-row" title="一行一个，每行的第一个 = 为分隔符。\n保存后生效">
            <div class="prefs_title">自定义替换规则</div>
            <textarea id="custom_replace_rules" class="prefs_textarea" placeholder="b[āà]ng=棒"></textarea>
        </div>
    </div>
</form>
