// spins the uploaded STL in 3D so you can see what you're about to submit
// all of this is plain three.js inside one effect. React only owns the empty <div>, three.js owns everything in it
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function StlViewer({ data }: { data: ArrayBuffer }) {
  const box = useRef<HTMLDivElement>(null); // the div three.js draws into
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = box.current;
    if (!host) return; // first render, the div isn't on the page yet

    let shape: THREE.BufferGeometry;
    try {
      shape = new STLLoader().parse(data);
    } catch {
      setError("This file couldn't be displayed. It may not be a valid STL."); // bad file isn't a crash
      return;
    }
    setError(null);

    shape.computeVertexNormals(); // stl has no normals, without these it renders flat grey
    shape.computeBoundingBox();
    const bounds = shape.boundingBox!;
    const middle = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    shape.translate(-middle.x, -middle.y, -middle.z); // move it onto the origin so orbiting spins the part, not around it
    const radius = Math.max(size.x, size.y, size.z) || 1; // everything below scales off this, so any size part frames right

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, radius / 100, radius * 100);
    camera.up.set(0, 0, 1); // cad convention, z is up. three.js assumes y
    camera.position.set(radius * 1.3, -radius * 1.6, radius * 1.1); // corner view, reads better than straight on

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // capped, retina at 3x melts laptops
    host.appendChild(renderer.domElement);

    const skin = new THREE.MeshStandardMaterial({ color: 0x7b86e8, metalness: 0.15, roughness: 0.55, side: THREE.DoubleSide });
    const part = new THREE.Mesh(shape, skin);
    scene.add(part);

    // 25 degrees = only draw lines on real corners, not across every triangle of a curve
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(shape, 25), new THREE.LineBasicMaterial({ color: 0x1b2040 }));
    scene.add(outline);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.1)); // fill, stops the underside going black
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(radius, -radius * 2, radius * 3);
    scene.add(keyLight);

    const grid = new THREE.GridHelper(radius * 3, 30, 0x8899aa, 0xc9d3dd);
    grid.rotation.x = Math.PI / 2; // GridHelper lies flat in xz, rotate it for a z-up world
    grid.position.z = -size.z / 2 - 0.01; // just under the part, not cutting through it
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    scene.add(grid);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // keeps drifting a moment after you let go

    // canvas has no layout of its own, so match it to the div whenever that changes
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h); // max(1,h) or it divides by zero while hidden
      camera.updateProjectionMatrix();
    };
    fit();
    const sizeWatcher = new ResizeObserver(fit);
    sizeWatcher.observe(host);

    let frame = 0;
    const draw = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };
    draw();

    // three.js holds gpu memory React knows nothing about, so every piece gets thrown away by hand
    return () => {
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      controls.dispose();
      shape.dispose();
      skin.dispose();
      outline.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [data]); // new file = tear the whole thing down and build it again

  return (
    <div className="stl-viewer" ref={box}>
      {error && <p className="stl-error">{error}</p>}
      <span className="stl-hint">Drag to rotate · scroll to zoom</span>
    </div>
  );
}
