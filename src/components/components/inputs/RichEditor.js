import React from 'react';
import MUIRichTextEditor from 'mui-rte';

/**
 * Render rich text editor
 */
const RichEditor = React.forwardRef(({
    id, defaultValue, label, labelMaxLength, hidden, onSave,
}, ref) => (

    <div className={`${hidden ? 'hidden' : ''} h-80 w-full mb-6 border border-solid rounded border-gray-300 relative`}>
        <div className="absolute right-3 top-3 font-light text-sm">{labelMaxLength}</div>
        <MUIRichTextEditor
            id={id}
            ref={ref}
            defaultValue={defaultValue}
            label={label}
            controls={['title', 'bold', 'italic', 'underline', 'link']}
            inlineToolbar={false}
            toolbarButtonSize="small"
            onBlur={() => ref.current.save()}
            onSave={(data) => onSave(data)}
            maxLength={560}
        />
    </div>
));

export default RichEditor;
