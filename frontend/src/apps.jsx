import {
  AboutApp,
  AboutThisMac,
  ClockApp,
  ContactApp,
  FinderApp,
  StudioApp,
} from "./components/AppContent.jsx";
import {
  DocIcon,
  FolderIcon,
  HardDiskIcon,
  MailIcon,
  StudioIcon,
} from "./components/Icons.jsx";

export const APPS = {
  hd: {
    title: "System",
    content: FinderApp,
    Icon: HardDiskIcon,
    rect: { x: 30, y: 40, w: 360, h: 250 },
  },
  about: {
    title: "About",
    content: AboutApp,
    Icon: FolderIcon,
    rect: { x: 40, y: 46, w: 340, h: 270 },
  },
  contact: {
    title: "Contact",
    content: ContactApp,
    Icon: MailIcon,
    rect: { x: 120, y: 60, w: 300, h: 240 },
  },
  studio: {
    title: "Studio",
    content: StudioApp,
    Icon: StudioIcon,
    rect: { x: 140, y: 80, w: 340, h: 380 },
    size: { w: 340, h: 380 },
    noResize: true,
  },
  aboutmac: {
    title: "About This Developer",
    content: AboutThisMac,
    Icon: DocIcon,
    rect: { x: 120, y: 70, w: 320, h: 280 },
    noResize: true,
  },
  clock: {
    title: "Date & Time",
    content: ClockApp,
    Icon: DocIcon,
    size: { w: 320, h: 300 },
    autoHeight: true,
    noResize: true,
  },
};
