import { useRef } from "react";
import { Canvas } from "react-three-fiber"
import * as three from "three";

const Cube = () => {
	const cube = useRef<three.Mesh>();
	return (
		<mesh 
		ref={cube} 
		position={[3.2, -1.9, 1]}
		rotation-z={0.5}
		>
			<boxGeometry arg={[1, 1, 1]} />
			<meshPhongMaterial color="#ffffff" specular="#61dafb" shininess={10} />
		</mesh>
	)
}

const Cone = () => {
	const cone = useRef<three.Mesh>();
	return (
		<mesh 
			ref={cone} 
			position={[-1.4, -0.6, 0.2]}
			rotation={[-0.5, 0.5, 0]}
		>
			<coneGeometry args={[0.4, 1, 20]} />
			<meshPhongMaterial color="#ffffff" specular="#61dafb" shininess={10} />
		</mesh>
	)
}

const Icosahedron = () => {
	const icosahedron = useRef<three.Mesh>();
	return (
		<mesh 
			ref={icosahedron} 
			position={[-6, -2, 0.1]}
			rotation={[-0.5, 0, -0.3]}
		>
			<icosahedronGeometry args={[0.8, 1]} />
			<meshPhongMaterial color="#ffffff" specular="#61dafb" shininess={10} />
		</mesh>
	)
}

const Torus = () => {
	const torus = useRef<three.Mesh>();
	return (
		<mesh ref={torus} position={[-5, 2.5, 0]}>
			<torusGeometry args={[0.2, 0.1, 10, 50]} />
			<meshPhongMaterial color="#fff" specular="#61dafb" shininess={10} />
		</mesh>
	)
}

const Dodecahedron = () => {
	const dodecahedron = useRef();
	return (
		<mesh 
			ref={dodecahedron} 
			position={[2, 0, 0]}
			rotation={[0, 0.4, 0.7]}
			
		>
			<dodecahedronGeometry args={[0.5, 0]} />
			<meshPhongMaterial color="#fff" specular="#61dafb" shininess={10} />
		</mesh>
	);
}

const Light = () => {
	return (
		<>
			<ambientLight intensity={0.2} />
			<spotLight color="#61dafb" position={[-10, -10, -10]} intensity={0.2}	 />
			<spotLight color="#61dafb" position={[-10, 0, 15]} intensity={0.8} />
			<spotLight color="#61dafb" position={[-5, 20, 2]} intensity={0.5} />
			<spotLight color="#f2056f" position={[15, 10, -2]} intensity={2} />
			<spotLight color="#f2056f" position={[15, 10, 5]} intensity={1} />
			<spotLight color="#b107db" position={[5, -10, 5]} intensity={0.8} />
		</>
	)
}

export function Shape() {
	return (
		<Canvas
			shadows
			resize={{ scroll: false, offsetSize: true }}
		>	
		<group
			center={[0,0,0]}
			>
			<Light />
		</group>
		<group>
			<Cube />
			<Cone />
			<Icosahedron />
			<Torus />
			<Dodecahedron />
		</group>
		</Canvas>
	)
}
