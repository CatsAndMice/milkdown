import { Editor ,ThemeIcon} from "@milkdown/core"
import { nord } from "@milkdown/theme-nord"
import { gfm } from "@milkdown/preset-gfm"
// 工具栏
import { menu } from '@milkdown/plugin-menu';
import { getIcon } from "./icon"
Editor
    .make()
    .use(nord.override((emotion, manager) => {
        manager.set(ThemeIcon, (icon) => {
            if (!icon) return;
            return getIcon(icon);
        });
    }))
    .use(gfm)
    .use(menu)
    .create()