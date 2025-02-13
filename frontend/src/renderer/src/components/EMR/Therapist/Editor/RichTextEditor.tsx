import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { AiOutlineBold, AiOutlineItalic, AiOutlineUnderline } from 'react-icons/ai'
import { BsListUl, BsListOl, BsTextCenter, BsTextLeft, BsTextRight } from 'react-icons/bs'
import { MdUndo, MdRedo, MdFormatColorText, MdImage, MdSave } from 'react-icons/md'
import { FiAlignJustify } from 'react-icons/fi'
import { BiCodeBlock } from 'react-icons/bi'

interface RichTextEditorProps {
  content?: string // Initial content
  showSaveButton?: boolean // Whether to show the save button
  width?: string // Width of the editor container
  onContentChange?: (content: string) => void
}

const MenuBar = ({
  editor,
  showSaveButton,
  showNotification
}: {
  editor: any
  showSaveButton?: boolean
  showNotification: (message: string, type: 'success' | 'error') => void
}) => {
  if (!editor) return null

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event: any) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result
          editor
            .chain()
            .focus()
            .setImage({ src: base64 as string })
            .run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex flex-wrap items-center bg-white border-b p-2 gap-2">
      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          title="Undo"
        >
          <MdUndo size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          title="Redo"
        >
          <MdRedo size={20} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Headings */}
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className={`p-2 w-10 rounded text-gray-600 hover:bg-gray-200 ${
              editor.isActive('heading', { level }) ? 'bg-gray-200' : ''
            }`}
            title={`Heading ${level}`}
          >
            H{level}
          </button>
        ))}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 w-10 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('paragraph') ? 'bg-gray-200' : ''
          }`}
          title="Paragraph"
        >
          P
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Bold"
        >
          <AiOutlineBold size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Italic"
        >
          <AiOutlineItalic size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('underline') ? 'bg-gray-200' : ''
          }`}
          title="Underline"
        >
          <AiOutlineUnderline size={20} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Alignment */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Left"
        >
          <BsTextLeft size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Center"
        >
          <BsTextCenter size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
          }`}
          title="Align Right"
        >
          <BsTextRight size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
          }`}
          title="Justify"
        >
          <FiAlignJustify size={20} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Lists */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
          title="Bullet List"
        >
          <BsListUl size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
          title="Numbered List"
        >
          <BsListOl size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('codeBlock') ? 'bg-gray-200' : ''
          }`}
          title="Code Block"
        >
          <BiCodeBlock size={20} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Colors */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            !editor.isActive('textStyle', { color: null }) ? 'bg-gray-200' : ''
          }`}
          title="Default Color"
        >
          <MdFormatColorText size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#f44336').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('textStyle', { color: '#f44336' }) ? 'bg-gray-200' : ''
          }`}
          title="Red Text"
        >
          <MdFormatColorText size={20} style={{ color: '#f44336' }} />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#4caf50').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('textStyle', { color: '#4caf50' }) ? 'bg-gray-200' : ''
          }`}
          title="Green Text"
        >
          <MdFormatColorText size={20} style={{ color: '#4caf50' }} />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#2196f3').run()}
          className={`p-2 rounded text-gray-600 hover:bg-gray-200 ${
            editor.isActive('textStyle', { color: '#2196f3' }) ? 'bg-gray-200' : ''
          }`}
          title="Blue Text"
        >
          <MdFormatColorText size={20} style={{ color: '#2196f3' }} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Image Upload */}
      <div className="flex gap-1">
        <button
          onClick={handleImageUpload}
          className="p-2 rounded text-gray-600 hover:bg-gray-200"
          title="Upload Image"
        >
          <MdImage size={20} />
        </button>
      </div>

      {/* Save Button */}
      {showSaveButton && (
        <button
          onClick={() => showNotification('Content Saved', 'success')}
          className="ml-auto p-2 text-gray-600 hover:bg-gray-200 rounded"
          title="Save Content"
        >
          <MdSave size={20} />
        </button>
      )}
    </div>
  )
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  showSaveButton = true,
  width = '100%',
  onContentChange
}) => {
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Color.configure({ types: [TextStyle.name, 'textStyle'] }),
      TextStyle
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none w-full h-full min-h-[400px] px-4 py-2'
      }
    },
    content,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML())
      }
    }
  })

  return (
    <div className=" bg-white flex flex-col items-center" style={{ width }}>
      <div className="flex flex-col w-full h-full">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <MenuBar editor={editor} showSaveButton={showSaveButton} showNotification={showNotification} />
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full p-4" />
        </div>
      </div>
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
