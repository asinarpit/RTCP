import { useEffect, useState } from 'react';
import { 
    Bold, 
    Italic, 
    Strikethrough, 
    Heading1, 
    Heading2, 
    List, 
    ListOrdered, 
    Undo2, 
    Redo2 
} from 'lucide-react';

interface MenuBarProps {
    editor: any;
}

const MenuBar = ({ editor }: MenuBarProps) => {
    const [, setUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;

        const handler = () => {
            setUpdate(prev => prev + 1);
        };

        editor.on("transaction", handler);
        return () => {
            editor.off("transaction", handler);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const items = [
        {
            icon: <Bold size={16} />,
            title: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive("bold"),
        },
        {
            icon: <Italic size={16} />,
            title: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive("italic"),
        },
        {
            icon: <Strikethrough size={16} />,
            title: "Strike",
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive("strike"),
        },
        {
            type: "divider",
        },
        {
            icon: <Heading1 size={16} />,
            title: "Heading 1",
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 size={16} />,
            title: "Heading 2",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
            type: "divider",
        },
        {
            icon: <List size={16} />,
            title: "Bullet List",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive("bulletList"),
        },
        {
            icon: <ListOrdered size={16} />,
            title: "Ordered List",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive("orderedList"),
        },
        {
            type: "divider",
        },
        {
            icon: <Undo2 size={16} />,
            title: "Undo",
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: <Redo2 size={16} />,
            title: "Redo",
            action: () => editor.chain().focus().redo().run(),
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-paper-border bg-[#faf9f6] sticky top-0 z-10">
            {items.map((item, index) => (
                item.type === "divider" ? (
                    <div key={index} className="w-px h-6 bg-paper-border mx-2" />
                ) : (
                    <button
                        key={index}
                        onClick={item.action}
                        title={item.title}
                        className={`
                            p-2 rounded-sm transition-all cursor-pointer
                            ${item.isActive?.() 
                                ? "bg-paper-ink text-white shadow-sm" 
                                : "text-paper-ink-muted hover:bg-paper-ink/5 hover:text-paper-ink"}
                        `}
                    >
                        {item.icon}
                    </button>
                )
            ))}
        </div>
    );
};

export default MenuBar;
