export function dragElement(sortableGridId){
    const gridContainer = document.getElementById(sortableGridId);
    let draggedItem = null;
    // Handle Drag Start
    gridContainer.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    e.target.style.opacity = "0.5";
    });
    // Handle Drag End
    gridContainer.addEventListener("dragend", (e) => {
    e.target.style.opacity = "1";
    draggedItem = null;
    });
    // Handle Dragging Over Grid Items
    gridContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    });
    // Handle Drop
    gridContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const targetItem = e.target;
    if (
        targetItem &&
        targetItem !== draggedItem &&
        targetItem.classList.contains("grid-item")
    ) {
        const draggedIndex = [...gridContainer.children].indexOf(draggedItem);
        const targetIndex = [...gridContainer.children].indexOf(targetItem);
        if (draggedIndex < targetIndex) {
        gridContainer.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
        gridContainer.insertBefore(draggedItem, targetItem);
        }
    }
    });
}