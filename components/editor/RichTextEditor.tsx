"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import "@/css/RichTextEditor.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  onExport?: (html: string) => void;
}

export default function RichTextEditor({
  value = "",
  onChange,
  onExport,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkUrlInputRef = useRef<HTMLInputElement>(null);

  const [internalHtml, setInternalHtml] = useState(value);
  const [selectedImageWrapper, setSelectedImageWrapper] =
    useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // History state
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Resize state
  const resizingRef = useRef(false);
  const resizeDataRef = useRef<any>(null);

  // Drag state
  const draggedImageRef = useRef<HTMLElement | null>(null);
  const dropIndicatorRef = useRef<HTMLElement | null>(null);

  const maxHistorySize = 50;

  // Sync with external value
  useEffect(() => {
    const newVal = value || "";
    if (newVal !== internalHtml && editorRef.current) {
      setInternalHtml(newVal);
      editorRef.current.innerHTML = newVal;
      attachImageControlsToAll();
    }
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    onChange?.(internalHtml);
  }, [internalHtml, onChange]);

  // Auto-focus modal input
  useEffect(() => {
    if (showLinkModal && linkUrlInputRef.current) {
      linkUrlInputRef.current.focus();
    }
  }, [showLinkModal]);

  const charCount = internalHtml.replace(/<[^>]*>/g, "").length;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveToHistory = useCallback(
    (content: string) => {
      if (isUndoRedoRef.current) return;

      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }

      historyTimeoutRef.current = setTimeout(() => {
        const currentContent = content || editorRef.current?.innerHTML || "";

        setHistory((prev) => {
          if (prev.length > 0 && prev[historyIndex] === currentContent) {
            return prev;
          }

          let newHistory =
            historyIndex < prev.length - 1
              ? prev.slice(0, historyIndex + 1)
              : [...prev];

          newHistory.push(currentContent);

          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
            setHistoryIndex((i) => i);
          } else {
            setHistoryIndex(newHistory.length - 1);
          }

          return newHistory;
        });
      }, 500);
    },
    [historyIndex]
  );

  const onInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      saveToHistory(html);
    }
  };

  const onBlur = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      saveToHistory(html);
    }
  };

  const format = (command: string, value: string | null = null) => {
    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      document.execCommand(command, false);
    } else {
      document.execCommand(command, false, value || undefined);
    }
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
      saveToHistory(editorRef.current.innerHTML);
    }
    restoreFocus();
  };

  const formatHeading = (tag: string) => {
    if (tag === "p") document.execCommand("formatBlock", false, "p");
    else if (tag === "h1") document.execCommand("formatBlock", false, "h1");
    else if (tag === "h2") document.execCommand("formatBlock", false, "h2");
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
      saveToHistory(editorRef.current.innerHTML);
    }
    restoreFocus();
  };

  const queryState = (command: string) => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };

  const getCurrentEditorRange = (): Range | null => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        return range.cloneRange();
      }
    }

    if (editorRef.current) {
      const range = document.createRange();
      if (editorRef.current.lastChild) {
        if (editorRef.current.lastChild.nodeType === Node.TEXT_NODE) {
          range.setStart(
            editorRef.current.lastChild,
            (editorRef.current.lastChild as Text).textContent?.length || 0
          );
        } else {
          range.setStartAfter(editorRef.current.lastChild);
        }
      } else {
        range.setStart(editorRef.current, 0);
      }
      range.collapse(true);
      return range;
    }

    return null;
  };

  const createLink = () => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    savedSelectionRef.current = getCurrentEditorRange();

    if (savedSelectionRef.current && !savedSelectionRef.current.collapsed) {
      setLinkText(savedSelectionRef.current.toString());
    } else {
      setLinkText("");
    }

    setLinkUrl("");
    setShowLinkModal(true);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;

    let url = linkUrl.trim();
    if (!url.match(/^https?:\/\//)) {
      url = "https://" + url;
    }

    editorRef.current?.focus();

    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.target = "_blank";
    linkElement.textContent = linkText.trim() || url;

    if (savedSelectionRef.current) {
      try {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelectionRef.current);

        savedSelectionRef.current.deleteContents();
        savedSelectionRef.current.insertNode(linkElement);

        const newRange = document.createRange();
        newRange.setStartAfter(linkElement);
        newRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      } catch (error) {
        console.error("Error inserting link:", error);
        editorRef.current?.appendChild(linkElement);
      }
    } else {
      editorRef.current?.appendChild(linkElement);
    }

    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
      saveToHistory(editorRef.current.innerHTML);
    }
    closeLinkModal();
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    savedSelectionRef.current = null;
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  const undo = () => {
    if (!canUndo || !editorRef.current) return;

    isUndoRedoRef.current = true;
    const newIndex = historyIndex - 1;
    const content = history[newIndex];
    editorRef.current.innerHTML = content;
    setInternalHtml(content);
    setHistoryIndex(newIndex);

    setTimeout(() => {
      attachImageControlsToAll();
      isUndoRedoRef.current = false;
    }, 0);
  };

  const redo = () => {
    if (!canRedo || !editorRef.current) return;

    isUndoRedoRef.current = true;
    const newIndex = historyIndex + 1;
    const content = history[newIndex];
    editorRef.current.innerHTML = content;
    setInternalHtml(content);
    setHistoryIndex(newIndex);

    setTimeout(() => {
      attachImageControlsToAll();
      isUndoRedoRef.current = false;
    }, 0);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please pick an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      insertImageAtCursor(ev.target?.result as string);
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertImageAtCursor = (dataUrl: string) => {
    const sel = window.getSelection();
    const wrapper = createImageWrapper(dataUrl);

    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.focus();
      editorRef.current?.appendChild(wrapper);
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
        saveToHistory(editorRef.current.innerHTML);
      }
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(wrapper);

    range.setStartAfter(wrapper);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    editorRef.current?.focus();

    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
      saveToHistory(editorRef.current.innerHTML);
    }
  };

  const createImageWrapper = (dataUrl: string): HTMLElement => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    wrapper.contentEditable = "false";

    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "inserted image";
    img.draggable = false;
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";

    const syncWrapperHeight = () => {
      if (img.complete && img.naturalHeight > 0) {
        wrapper.style.height = img.offsetHeight + "px";
      }
    };

    img.addEventListener("load", syncWrapperHeight);
    if (img.complete) {
      setTimeout(syncWrapperHeight, 0);
    }

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(syncWrapperHeight);
      resizeObserver.observe(img);
      (wrapper as any)._resizeObserver = resizeObserver;
    }

    const handles = [
      { class: "nw", cursor: "nw-resize" },
      { class: "n", cursor: "n-resize" },
      { class: "ne", cursor: "ne-resize" },
      { class: "e", cursor: "e-resize" },
      { class: "se", cursor: "se-resize" },
      { class: "s", cursor: "s-resize" },
      { class: "sw", cursor: "sw-resize" },
      { class: "w", cursor: "w-resize" },
    ];

    handles.forEach(({ class: className, cursor }) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${className}`;
      handle.style.cursor = cursor;
      handle.dataset.direction = className;
      wrapper.appendChild(handle);

      handle.addEventListener("mousedown", (e) =>
        startImageResize(e, wrapper, className)
      );
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "image-remove-btn";
    removeBtn.innerHTML = "×";
    removeBtn.title = "Remove image";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.remove();
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
      }
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);

    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      selectImageWrapper(wrapper);
    });

    wrapper.draggable = true;
    wrapper.addEventListener("dragstart", (e) => startImageDrag(e, wrapper));
    wrapper.addEventListener("dragend", (e) => endImageDrag(e, wrapper));

    return wrapper;
  };

  const attachImageControlsToAll = () => {
    if (!editorRef.current) return;
    const imgs = editorRef.current.querySelectorAll("img.rte-image");
    imgs.forEach((img) => {
      if (!img.parentElement?.classList.contains("image-wrapper")) {
        const wrapper = createImageWrapper((img as HTMLImageElement).src);
        img.parentNode?.replaceChild(wrapper, img);
      }
    });
  };

  const onEditorClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".image-wrapper")) return;
    deselectImageWrapper();
  };

  const selectImageWrapper = (wrapper: HTMLElement) => {
    deselectImageWrapper();
    setSelectedImageWrapper(wrapper);
    wrapper.classList.add("selected");
  };

  const deselectImageWrapper = () => {
    if (selectedImageWrapper) {
      selectedImageWrapper.classList.remove("selected");
    }
    setSelectedImageWrapper(null);
  };

  const startImageDrag = (e: DragEvent, wrapper: HTMLElement) => {
    draggedImageRef.current = wrapper;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/html", wrapper.outerHTML);
    wrapper.classList.add("dragging");
    createDropIndicator();
  };

  const endImageDrag = (e: DragEvent, wrapper: HTMLElement) => {
    wrapper.classList.remove("dragging");
    removeDropIndicator();
    draggedImageRef.current = null;
  };

  const createDropIndicator = () => {
    const indicator = document.createElement("div");
    indicator.className = "drop-indicator";
    indicator.style.height = "3px";
    indicator.style.backgroundColor = "#4a90e2";
    indicator.style.margin = "5px 0";
    indicator.style.borderRadius = "2px";
    indicator.style.opacity = "0";
    indicator.style.transition = "opacity 0.2s ease";
    dropIndicatorRef.current = indicator;
  };

  const removeDropIndicator = () => {
    if (dropIndicatorRef.current?.parentNode) {
      dropIndicatorRef.current.parentNode.removeChild(dropIndicatorRef.current);
    }
    dropIndicatorRef.current = null;
  };

  const showDropIndicator = (
    element: HTMLElement,
    position: "before" | "after"
  ) => {
    if (!dropIndicatorRef.current) return;
    removeDropIndicator();

    if (position === "before") {
      element.parentNode?.insertBefore(dropIndicatorRef.current, element);
    } else {
      element.parentNode?.insertBefore(
        dropIndicatorRef.current,
        element.nextSibling
      );
    }

    dropIndicatorRef.current.style.opacity = "1";
  };

  const handleImageDragOver = (e: DragEvent) => {
    if (
      !draggedImageRef.current ||
      !dropIndicatorRef.current ||
      !editorRef.current
    )
      return;

    const y = e.clientY;
    const editorRect = editorRef.current.getBoundingClientRect();
    const relativeY = y - editorRect.top + editorRef.current.scrollTop;

    const children = Array.from(editorRef.current.children);
    let insertBefore: HTMLElement | null = null;
    let insertAfter: HTMLElement | null = null;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (
        child === draggedImageRef.current ||
        child === dropIndicatorRef.current
      )
        continue;

      const childRect = child.getBoundingClientRect();
      const childY =
        childRect.top - editorRect.top + editorRef.current.scrollTop;
      const childMidY = childY + childRect.height / 2;

      if (relativeY < childMidY) {
        insertBefore = child;
        break;
      } else {
        insertAfter = child;
      }
    }

    if (insertBefore) {
      showDropIndicator(insertBefore, "before");
    } else if (insertAfter) {
      showDropIndicator(insertAfter, "after");
    } else {
      if (
        editorRef.current.lastElementChild &&
        editorRef.current.lastElementChild !== draggedImageRef.current
      ) {
        showDropIndicator(
          editorRef.current.lastElementChild as HTMLElement,
          "after"
        );
      }
    }
  };

  const handleImageDrop = (e: DragEvent) => {
    if (!draggedImageRef.current || !dropIndicatorRef.current) return;

    const indicatorParent = dropIndicatorRef.current.parentNode;
    const indicatorNextSibling = dropIndicatorRef.current.nextSibling;

    removeDropIndicator();

    if (indicatorNextSibling) {
      indicatorParent?.insertBefore(
        draggedImageRef.current,
        indicatorNextSibling
      );
    } else {
      indicatorParent?.appendChild(draggedImageRef.current);
    }

    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
      saveToHistory(editorRef.current.innerHTML);
    }

    draggedImageRef.current.classList.remove("dragging");
    draggedImageRef.current = null;
  };

  const startImageResize = (
    e: MouseEvent,
    wrapper: HTMLElement,
    direction: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    resizingRef.current = true;
    const rect = wrapper.getBoundingClientRect();

    resizeDataRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      wrapper,
      direction,
      aspect: rect.width / rect.height,
      maintainAspect: e.shiftKey,
    };

    document.addEventListener("mousemove", onImageResize);
    document.addEventListener("mouseup", stopImageResize);
    document.addEventListener("keydown", onResizeKeyDown);
    document.addEventListener("keyup", onResizeKeyUp);

    document.body.style.cursor = (e.target as HTMLElement).style.cursor;
    document.body.style.userSelect = "none";
  };

  const onImageResize = (e: MouseEvent) => {
    if (!resizingRef.current || !resizeDataRef.current || !editorRef.current)
      return;
    e.preventDefault();

    const {
      startX,
      startY,
      startWidth,
      startHeight,
      wrapper,
      direction,
      aspect,
    } = resizeDataRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;

    switch (direction) {
      case "nw":
      case "w":
      case "sw":
        newWidth = Math.max(50, startWidth - dx);
        break;
      case "ne":
      case "e":
      case "se":
        newWidth = Math.max(50, startWidth + dx);
        break;
      case "n":
      case "s":
        const heightChange = direction === "n" ? -dy : dy;
        const newHeight = Math.max(50, startHeight + heightChange);
        newWidth = newHeight * aspect;
        break;
    }

    const editorRect = editorRef.current.getBoundingClientRect();
    const maxWidth = editorRect.width - 32;
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }

    wrapper.style.width = Math.round(newWidth) + "px";
  };

  const stopImageResize = () => {
    if (!resizingRef.current) return;
    resizingRef.current = false;

    document.removeEventListener("mousemove", onImageResize);
    document.removeEventListener("mouseup", stopImageResize);
    document.removeEventListener("keydown", onResizeKeyDown);
    document.removeEventListener("keyup", onResizeKeyUp);

    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    resizeDataRef.current = null;
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
    }
  };

  const onResizeKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Shift" && resizeDataRef.current) {
      resizeDataRef.current.maintainAspect = true;
    }
  };

  const onResizeKeyUp = (ev: KeyboardEvent) => {
    if (ev.key === "Shift" && resizeDataRef.current) {
      resizeDataRef.current.maintainAspect = false;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") {
      setIsCtrlPressed(true);
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "z" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      undo();
      return;
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === "y" ||
        (e.key.toLowerCase() === "z" && e.shiftKey))
    ) {
      e.preventDefault();
      redo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      format("bold");
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      format("italic");
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      format("underline");
    }

    if ((e.key === "Delete" || e.key === "Backspace") && selectedImageWrapper) {
      e.preventDefault();
      selectedImageWrapper.remove();
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
        saveToHistory(editorRef.current.innerHTML);
      }
      deselectImageWrapper();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") {
      setIsCtrlPressed(false);
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const html = text
      .split("\n")
      .map((line) => (line ? escapeHtml(line) : "<br>"))
      .join("<br>");
    insertHtmlAtCursor(html);
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
    }
  };

  const escapeHtml = (s: string) => {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  };

  const insertHtmlAtCursor = (html: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.insertAdjacentHTML("beforeend", html);
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
      }
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const frag = document.createRange().createContextualFragment(html);
    range.insertNode(frag);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
    }
  };

  const restoreFocus = () => {
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "A" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open((e.target as HTMLAnchorElement).href, "_blank");
    }
  };

  const handleLinkHover = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && isCtrlPressed) {
      target.title = "Click to visit link";
      target.style.cursor = "pointer";
    } else if (target.tagName === "A") {
      target.title = "Ctrl+Click to visit link";
      target.style.cursor = "text";
    }
  };

  const handleLinkLeave = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
      target.title = "";
      target.style.cursor = "";
    }
  };

  const placeCaretAtEnd = (el: HTMLElement) => {
    el.focus();
    if (
      typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined"
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedImageRef.current) {
      e.dataTransfer.dropEffect = "move";
      handleImageDragOver(e.nativeEvent);
    } else {
      e.dataTransfer.dropEffect = "copy";
    }

    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    removeDropIndicator();

    const dt = e.dataTransfer;
    const files = dt?.files;
    const x = e.clientX;
    const y = e.clientY;

    if (draggedImageRef.current) {
      handleImageDrop(e.nativeEvent);
      return;
    }

    if (files && files.length) {
      handleDroppedFiles(files, x, y);
    } else {
      const uri = dt.getData("text/uri-list") || dt.getData("text/plain");
      if (uri && isImageUrl(uri)) {
        insertImageAtPoint(uri, x, y);
        if (editorRef.current) {
          setInternalHtml(editorRef.current.innerHTML);
        }
      } else {
        const html = dt.getData("text/html");
        if (html) insertHtmlAtPoint(html, x, y);
      }
    }
  };

  const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp|svg|bmp)(\?|$)/i.test(url);
  };

  const handleDroppedFiles = (fileList: FileList, x: number, y: number) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter(
      (f) => f.type && f.type.startsWith("image/")
    );
    if (!imageFiles.length) return;

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        insertImageAtPoint(ev.target?.result as string, x, y);
        if (editorRef.current) {
          setInternalHtml(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const insertImageAtPoint = (dataUrlOrUrl: string, x: number, y: number) => {
    const range = getRangeFromPoint(x, y);
    const wrapper = createImageWrapper(dataUrlOrUrl);

    if (!range) {
      editorRef.current?.appendChild(wrapper);
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
      }
      return;
    }

    range.deleteContents();
    range.insertNode(wrapper);

    range.setStartAfter(wrapper);
    range.collapse(true);

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    editorRef.current?.focus();
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
    }
  };

  const insertHtmlAtPoint = (html: string, x: number, y: number) => {
    const range = getRangeFromPoint(x, y);
    if (!range) {
      editorRef.current?.insertAdjacentHTML("beforeend", html);
      if (editorRef.current) {
        setInternalHtml(editorRef.current.innerHTML);
      }
      return;
    }
    range.deleteContents();
    const frag = document.createRange().createContextualFragment(html);
    range.insertNode(frag);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    editorRef.current?.focus();
    if (editorRef.current) {
      setInternalHtml(editorRef.current.innerHTML);
    }
  };

  const getRangeFromPoint = (x: number, y: number): Range | null => {
    let range: Range | null = null;
    if (document.caretRangeFromPoint) {
      try {
        range = document.caretRangeFromPoint(x, y);
      } catch (e) {
        range = null;
      }
    } else if ((document as any).caretPositionFromPoint) {
      try {
        const pos = (document as any).caretPositionFromPoint(x, y);
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      } catch (e) {
        range = null;
      }
    }

    if (!range && editorRef.current) {
      const el = document.elementFromPoint(x, y);
      try {
        range = document.createRange();
        if (el && el.nodeType === 3) {
          range.setStart(el, 0);
        } else if (el) {
          range.selectNodeContents(el);
          range.collapse(false);
        } else {
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
        }
      } catch (e) {
        range = null;
      }
    }
    return range;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = internalHtml || "";
      attachImageControlsToAll();
      editorRef.current.setAttribute("tabindex", "0");
      setHistory([internalHtml || ""]);
      setHistoryIndex(0);
    }

    return () => {
      if (editorRef.current) {
        const wrappers = editorRef.current.querySelectorAll(".image-wrapper");
        wrappers.forEach((wrapper) => {
          if ((wrapper as any)._resizeObserver) {
            (wrapper as any)._resizeObserver.disconnect();
          }
        });
      }
    };
  }, []);

  return (
    <div className="rte">
      <div className="toolbar">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="undo-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="redo-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </button>

        <div className="divider"></div>

        <button
          onClick={() => format("bold")}
          className={queryState("bold") ? "active" : ""}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => format("italic")}
          className={queryState("italic") ? "active" : ""}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => format("underline")}
          className={queryState("underline") ? "active" : ""}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <div className="divider"></div>

        <button onClick={() => formatHeading("p")} title="Paragraph">
          P
        </button>
        <button onClick={() => formatHeading("h1")} title="Heading 1">
          H1
        </button>
        <button onClick={() => formatHeading("h2")} title="Heading 2">
          H2
        </button>

        <div className="divider"></div>

        <button
          onClick={() => format("insertUnorderedList")}
          title="Bullet list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l11 0" />
            <path d="M9 12l11 0" />
            <path d="M9 18l11 0" />
            <path d="M5 6l0 .01" />
            <path d="M5 12l0 .01" />
            <path d="M5 18l0 .01" />
          </svg>
        </button>
        <button
          onClick={() => format("insertOrderedList")}
          title="Numbered list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11 6h9" />
            <path d="M11 12h9" />
            <path d="M12 18h8" />
            <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
            <path d="M6 10v-6l-2 2" />
          </svg>
        </button>

        <div className="divider"></div>

        <button onClick={createLink} title="Insert link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15l6 -6" />
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
            <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
          </svg>
        </button>

        <div className="divider"></div>

        <button onClick={triggerImageUpload} title="Insert image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ height: "1.35rem", width: "1.35rem" }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8h.01" />
            <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
            <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
            <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>

      <div
        ref={editorRef}
        className={`editor ${isDragging ? "drag-over" : ""} ${
          isCtrlPressed ? "ctrl-pressed" : ""
        }`}
        contentEditable="true"
        spellCheck="true"
        onInput={onInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPaste={onPaste}
        onClick={handleLinkClick}
        onClickCapture={onEditorClick}
        onMouseOver={handleLinkHover}
        onMouseLeave={handleLinkLeave}
        onBlur={onBlur}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      ></div>

      {showLinkModal && (
        <div className="modal-overlay" onClick={closeLinkModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="font-semibold">Insert Link</span>
              <button className="modal-close" onClick={closeLinkModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="linkUrl">URL:</label>
                <input
                  id="linkUrl"
                  ref={linkUrlInputRef}
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  type="url"
                  placeholder="https://example.com"
                  onKeyUp={(e) => e.key === "Enter" && insertLink()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkText">Display Text (optional):</label>
                <input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  type="text"
                  placeholder="Link text"
                  onKeyUp={(e) => e.key === "Enter" && insertLink()}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={closeLinkModal}
                type="button"
                style={{
                  transition: "ease 0.5s",
                  fontSize: "calc(var(--p4) * 0.9)",
                }}
                className={`py-1 flex items-center px-2 bg-white hover:brightness-95 font-medium border border-[var(--c-border)]  rounded-[0.35rem] cursor-pointer`}
              >
                Cancel
              </button>

              <button
                onClick={insertLink}
                disabled={!linkUrl.trim()}
                type="button"
                style={{
                  transition: "ease 0.5s",
                  fontSize: "calc(var(--p4) * 0.9)",
                }}
                className={`py-1 px-2 bg-[#F38D3B] hover:brightness-95 font-medium border border-[var(--c-border)]  rounded-[0.35rem] cursor-pointer text-white ml-3`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
