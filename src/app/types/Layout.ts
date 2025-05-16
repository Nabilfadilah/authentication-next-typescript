// componen sidebar
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// componen navbar
interface NavbarProps {
  onToggleSidebar: () => void;
}
