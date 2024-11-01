import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from '@react-three/fiber/native';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from '@react-three/drei/native';
import { Asset } from 'expo-asset';
// Create a loader instance outside the component
const loader = new FBXLoader();

const Model = () => {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    async function loadModel() {
      try {
        // Load the asset using Expo's Asset system
        const asset = Asset.fromModule(require('../assets/indoor_plant/indoor_plant.fbx'));
        await asset.downloadAsync();
        
        // Now use the local URI of the asset
        loader.load(asset.localUri!, (fbx) => {
          console.log("FBX loaded successfully");
          
          fbx.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x008000,
                roughness: 0.5,
                metalness: 0.5,
              });
            }
          });

          fbx.scale.set(0.01, 0.01, 0.01);
          
          // Center the model
          const box = new THREE.Box3().setFromObject(fbx);
          const center = box.getCenter(new THREE.Vector3());
          fbx.position.sub(center);
          
          setModel(fbx);
        }, 
        // Progress callback
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        // Error callback
        (error) => {
          console.error('Error loading FBX:', error);
        });
      } catch (error) {
        console.error('Error in loadModel:', error);
      }
    }

    loadModel();
  }, []);

  if (!model) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return <primitive object={model} />;
};

const ShopItem = ({ item, width }: { item: any; width: number }) => {
  return (
    <View style={[styles.itemWrapper, { width }]}>
      <View style={styles.modelContainer}>
        <Canvas style={{ width: 300, height: 300 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model />
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              enableRotate={true}
              minDistance={1}
              maxDistance={10}/>
          </Suspense>
        </Canvas>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price} coins</Text>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: "1%", // Removed the hardcoded width
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 5,
  },
  itemImage: {
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  modelContainer: {

  }
});