// Third-person camera that keeps the horizon level on a sphere, an orbital planet view,
// and smooth flights between them (used by the opening fall from orbit).
import * as THREE from 'three';

export type CamMode = 'follow' | 'orbit';

interface Pose { pos: THREE.Vector3; quat: THREE.Quaternion }

const lookPose = (pos: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Pose => {
  const m = new THREE.Matrix4().lookAt(pos, target, up);
  return { pos: pos.clone(), quat: new THREE.Quaternion().setFromRotationMatrix(m) };
};

export class CameraRig {
  mode: CamMode = 'orbit';
  pitch = 0.3;          // follow camera height angle (radians)
  dist = 6.5;
  orbitYaw = 0;
  orbitPitch = 0.55;
  orbitDist: number;
  autoSpin = 0;         // radians per second of slow orbit drift (title screen)
  titleFrame = 0;       // 1 = pull back and drop the planet low in the frame, under the logo
  shoulder = 0.75;      // metres to the right of the Custodian
  private from: Pose | null = null;
  private t = 1;
  private dur = 1.2;
  private smoothPos = new THREE.Vector3();
  private smoothUp = new THREE.Vector3(0, 1, 0);
  private first = true;

  constructor(private camera: THREE.PerspectiveCamera, planetRadius: number, private groundRadius: (dir: THREE.Vector3) => number) {
    this.orbitDist = planetRadius * 3.4;
  }

  setMode(mode: CamMode, duration = 1.2) {
    if (mode === this.mode) return;
    this.from = { pos: this.camera.position.clone(), quat: this.camera.quaternion.clone() };
    this.mode = mode;
    this.t = 0;
    this.dur = duration;
  }

  get transitioning() { return this.t < 1; }

  private followPose(target: THREE.Vector3, up: THREE.Vector3, heading: THREE.Vector3): Pose {
    // Over the right shoulder, so the Custodian never hides the crosshair.
    const rightV = new THREE.Vector3().crossVectors(heading, up).normalize();
    const look = target.clone().addScaledVector(up, 1.55).addScaledVector(rightV, this.shoulder);
    const back = heading.clone().negate();
    const dir = back.multiplyScalar(Math.cos(this.pitch)).addScaledVector(up, Math.sin(this.pitch)).normalize();
    const pos = look.clone().addScaledVector(dir, this.dist);
    // Keep the camera above the ground.
    const pd = pos.clone().normalize();
    const g = this.groundRadius(pd) + 0.7;
    if (pos.length() < g) pos.copy(pd.multiplyScalar(g));
    return lookPose(pos, look.clone().addScaledVector(heading, 1.2), up);
  }

  private orbitPose(up: THREE.Vector3, heading: THREE.Vector3): Pose {
    let d = up.clone().multiplyScalar(Math.cos(this.orbitPitch)).addScaledVector(heading, -Math.sin(this.orbitPitch)).normalize();
    d = d.applyAxisAngle(up, this.orbitYaw);
    const screenUp = heading.clone().applyAxisAngle(up, this.orbitYaw);
    const dist = this.orbitDist * (1 + 0.35 * this.titleFrame);
    const pos = d.multiplyScalar(dist);
    const camUp = screenUp.clone().addScaledVector(d, -screenUp.dot(d)).normalize();
    const look = camUp.multiplyScalar(this.orbitDist * 0.42 * this.titleFrame);
    return lookPose(pos, look, screenUp);
  }

  update(dt: number, playerPos: THREE.Vector3, up: THREE.Vector3, heading: THREE.Vector3) {
    this.orbitYaw += this.autoSpin * dt;
    // Smooth the follow target so walking over bumps does not shake the view.
    if (this.first) { this.smoothPos.copy(playerPos); this.smoothUp.copy(up); this.first = false; }
    this.smoothPos.lerp(playerPos, 1 - Math.exp(-14 * dt));
    this.smoothUp.lerp(up, 1 - Math.exp(-10 * dt)).normalize();
    const target = this.mode === 'follow' ? this.followPose(this.smoothPos, this.smoothUp, heading) : this.orbitPose(up, heading);

    if (this.t < 1 && this.from) {
      this.t = Math.min(1, this.t + dt / this.dur);
      const k = this.t * this.t * (3 - 2 * this.t);
      const k2 = k * k * (3 - 2 * k); // extra ease for long flights
      const ra = this.from.pos.length(), rb = target.pos.length();
      const da = this.from.pos.clone().normalize(), db = target.pos.clone().normalize();
      const ang = da.angleTo(db);
      let dir: THREE.Vector3;
      if (ang < 1e-4) dir = db;
      else {
        const axis = new THREE.Vector3().crossVectors(da, db).normalize();
        dir = da.clone().applyAxisAngle(axis, ang * k);
      }
      this.camera.position.copy(dir.multiplyScalar(THREE.MathUtils.lerp(ra, rb, k2)));
      this.camera.quaternion.slerpQuaternions(this.from.quat, target.quat, k);
    } else {
      this.camera.position.copy(target.pos);
      this.camera.quaternion.copy(target.quat);
    }
  }
}
