import { defaultValueCtx, Editor, rootCtx, ThemeIcon, themeManagerCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
// import { commonmark,image, link} from "@milkdown/preset-commonmark";
import { gfm, image, link } from "@milkdown/preset-gfm"
import { emoji } from "@milkdown/plugin-emoji";
import { listenerCtx, listener } from "@milkdown/plugin-listener"
import { tooltipPlugin, tooltip } from '@milkdown/plugin-tooltip';
// 工具栏
import { menu, menuPlugin, defaultConfig } from '@milkdown/plugin-menu';
import { clipboard } from '@milkdown/plugin-clipboard';
import { diagram } from '@milkdown/plugin-diagram';
// 添加/命令
import {
  slash,
  createDropdownItem,
  defaultActions,
  slashPlugin
} from '@milkdown/plugin-slash';
import { getIcon } from "./icon"

let output = ''
Editor.make()
  .config((ctx) => {
    ctx.set(rootCtx, document.querySelector('#app'));
    ctx.set(defaultValueCtx, "## 点赞+评论+关注=学会");
    ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
      output = markdown;
      console.log(output);
    });
  })
  .use(nord.override((emotion, manager) => {
    manager.set(ThemeIcon, (icon) => {
      if (!icon) return;
      return getIcon(icon);
    });
  }))
  // 添加图片/链接提示
  .use(gfm.configure(link, {
    input: {
      placeholder: "请输入链接...",
      buttonText: "链接"
    }
  })
    .configure(image, {
      input: {
        placeholder: "请输入链接...",
        buttonText: "链接"
      }
    }))
  .use(diagram)
  .use(emoji)
  .use(listener)
  .use(menu.configure(menuPlugin, {
    config: defaultConfig.map(config => {
      return config.map(c => {
        if (c.type !== "select") return c;
        switch (c.text) {
          case "Heading": {
            return {
              ...c,
              text: "标题",
              options: [
                { id: "1", text: "标题1" },
                { id: "2", text: "标题2" },
                { id: "3", text: "标题3" },
                { id: "4", text: "标题4" },
                { id: "5", text: "标题5" },
                { id: "0", text: "正文" }
              ]
            };
          }
          default:
            return x;
        }
      })
    })
  }))
  // 选中工具
  .use(tooltip.configure(tooltipPlugin, {
    top: true,
  }))
  // 设置'/'选择项
  .use(slash.configure(slashPlugin, {
    config: (ctx) => {
      return ({ content, isTopLevel }) => {
        if (!isTopLevel) return null;
        if (!content) {
          return { placeholder: "键入文字或'/'选择" };
        }

        const mapActions = (action) => {
          const { id = "" } = action;
          switch (id) {
            case "h1":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "标题1",
                "h1"
              );
              return action;
            case "h2":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "标题2",
                "h2"
              );
              return action;
            case "h3":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "标题3",
                "h3"
              );
              return action;
            case "h4":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "标题4",
                "h4"
              );
              return action;
            case "bulletList":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "列表",
                "bulletList"
              );
              return action;
            case "orderedList":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "数字列表",
                "orderedList"
              );
              return action;
            case "image":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "图片",
                "image"
              );
              return action;
            case "blockquote":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "引述文字",
                "quote"
              );
              return action;
            case "code":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "代码块",
                "code"
              );
              return action;
            case "divider":
              action.dom = createDropdownItem(
                ctx.get(themeManagerCtx),
                "分割线",
                "divider"
              );
              return action;
            default:
              return action;
          }
        };

        if (content.startsWith("/")) {
          return content === "/"
            ? {
              placeholder: " ",
              actions: defaultActions(ctx).map(mapActions)
            }
            : {
              actions: defaultActions(ctx, content).map(mapActions)
            };
        }

        return null;
      };
    }
  }))
  .use(clipboard)
  .create();


