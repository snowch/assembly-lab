// Copyright © 2026 Christopher Snow

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/lesson.css";
import "@al/views/views.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root element");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import "./styles/flags-lesson.css";
import "./styles/course-layout.css";
import "./styles/lesson-sources.css";

import "./styles/header-calculator.css";

import "./styles/instruction-reference.css";

import "./styles/shared-course.css";
