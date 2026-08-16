# 🧊 FixMyCube - 3D Rubik's Cube Scanner & Solver Studio

An interactive 3x3 Rubik's Cube web application featuring live webcam scanning, HSV color classification, 2D net review & editing, solvability state validation, client-side Kociemba 2-phase solving algorithm, and a 3D move-by-move animated player.

---

## ✨ Features

- 📹 **Live Webcam Scanner**: Auto-detects face sticker colors using real-time RGB-to-HSV color sampling with 3x3 alignment guides.
- 🎨 **2D Unfolded Net Review**: Interactive 2D cross layout allowing sticker color manual overrides and high-contrast color letter overlays (`W`, `Y`, `R`, `O`, `B`, `G`).
- ⚡ **Kociemba 2-Phase Solver Engine**: Client-side optimal solving in under 500ms producing ~20-move solutions.
- 🎮 **3D Animated Move Player**: Three.js & `@react-three/fiber` dynamic 3D cube player with layer rotation animations, step-by-step timeline, play/pause controls, speed slider ($0.5\times$ to $2\times$), and victory confetti.
- 🎯 **Preset Scrambles & Demo Mode**: Built-in scrambles (Superflip, Checkerboard, 5-Move Easy, Random 20-Move) for testing without camera hardware.

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 18
- **3D Visualization**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling**: Tailwind CSS v4 + Custom Dark Glassmorphism Theme
- **Solving Engine**: `cubejs` (Kociemba algorithm)
- **Computer Vision**: HTML5 Canvas ROI Sampling + HSV & Euclidean Color Classification
- **Icons & Effects**: Lucide React + `canvas-confetti`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/rubiks-cube-solver.git
cd rubiks-cube-solver
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
```

---

## 🐙 Deployment to GitHub

To push this repository to GitHub:

```bash
# 1. Create a repository on GitHub (e.g. rubiks-cube-solver)

# 2. Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/rubiks-cube-solver.git

# 3. Push to main branch
git branch -M main
git push -u origin main
```
