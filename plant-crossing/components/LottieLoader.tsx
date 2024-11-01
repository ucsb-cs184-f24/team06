import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import { AnimationObject } from 'lottie-react-native';

interface LottieLoaderProps {
  size?: number;
  color?: string;
  duration?: number;
  loop?: boolean;
}

interface LottieShape {
  ty: string;
  d?: number;
  s?: {
    a: number;
    k: number[];
  };
  p?: {
    a: number;
    k: number[];
  };
  r?: {
    a: number;
    k: number | number[];
  };
  c?: {
    a: number;
    k: number[];
  };
}

interface LottieLayer {
  ddd: number;
  ind: number;
  ty: number;
  nm: string;
  sr: number;
  ks: {
    o: { a: number; k: number };
    p: { a: number; k: number[] };
    s: {
      a: number;
      k: Array<{
        t: number;
        s: number[];
        h: number;
      }> | number[];
    };
    r?: { a: number; k: number };
  };
  shapes: LottieShape[];
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
  size = 500,
  color = '#4CAF50',
  duration = 2000,
  loop = true,
}) => {

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    };
  };

  const plantAnimation: AnimationObject = {
    v: "5.7.6",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Growing Plant",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Stem",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [100, 180, 0] },
          s: {
            a: 1,
            k: [
              {
                t: 0,
                s: [100, 0, 100],
                h: 0
              },
              {
                t: 24,
                s: [100, 100, 100],
                h: 0
              }
            ]
          }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [20, 120] },
            p: { a: 0, k: [0, -60] },
            r: { a: 0, k: 10 }
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.3, 0.69, 0.31] }
          }
        ]
      } as LottieLayer,
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Left Leaf",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [70, 120, 0] },
          s: {
            a: 1,
            k: [
              {
                t: 24,
                s: [0, 0, 100],
                h: 0
              },
              {
                t: 42,
                s: [100, 100, 100],
                h: 0
              }
            ]
          },
          r: { a: 0, k: 45 }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [40, 40] },
            r: { a: 0, k: [20, 0, 20, 0] }
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.3, 0.69, 0.31] }
          }
        ]
      } as LottieLayer,
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "Right Leaf",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [130, 120, 0] },
          s: {
            a: 1,
            k: [
              {
                t: 24,
                s: [0, 0, 100],
                h: 0
              },
              {
                t: 42,
                s: [100, 100, 100],
                h: 0
              }
            ]
          },
          r: { a: 0, k: -45 }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [40, 40] },
            r: { a: 0, k: [20, 0, 20, 0] }
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.3, 0.69, 0.31] }
          }
        ]
      } as LottieLayer,
      {
        ddd: 0,
        ind: 4,
        ty: 4,
        nm: "Top Leaf",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [100, 80, 0] },
          s: {
            a: 1,
            k: [
              {
                t: 42,
                s: [0, 0, 100],
                h: 0
              },
              {
                t: 60,
                s: [100, 100, 100],
                h: 0
              }
            ]
          }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [40, 40] },
            r: { a: 0, k: [20, 0, 20, 0] }
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.3, 0.69, 0.31] }
          }
        ]
      } as LottieLayer
    ]
  };

  const rgb = hexToRgb(color);
  const animationWithColor: AnimationObject = {
    ...plantAnimation,
    layers: plantAnimation.layers.map(layer => ({
      ...layer,
      shapes: layer.shapes.map((shape: LottieShape) => {
        if (shape.ty === 'fl') {
          return {
            ...shape,
            c: { a: 0, k: [rgb.r, rgb.g, rgb.b] }
          };
        }
        return shape;
      })
    }))
  };

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <LottieView
        source={animationWithColor}
        autoPlay
        loop={loop}
        speed={2000 / duration}
        style={{ width: size, height: size }}
      />
    </View>
  );
};

export default LottieLoader;