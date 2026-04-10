import React, { useEffect, useRef, useState, useCallback } from 'react';

const SpinePet = ({ spineData = '/spine.json', autoPlay = true, isTomatoActive = false, scale = 0.005 }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const skeletonRef = useRef(null);
  const animationStateRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  const [currentAnimation, setCurrentAnimation] = useState('standby/standby（slow）');
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [tomatoActive, setTomatoActive] = useState(isTomatoActive);
  const tomatoActiveRef = useRef(isTomatoActive);
  const clickAnimationIndexRef = useRef(0);
  const randomAnimationTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastKeyTimeRef = useRef(0);

  const savePosition = useCallback((newPosition) => {
    try {
      localStorage.setItem('spine_pet_position', JSON.stringify(newPosition));
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('spine_pet_position');
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current || !containerRef.current) return;
    isInitializedRef.current = true;

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.backgroundColor = 'rgba(0,0,0,0)';
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    const loadSpine = async () => {
      const waitSpine = () => new Promise(resolve => {
        if (window.spine) resolve();
        else {
          const interval = setInterval(() => {
            if (window.spine) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        }
      });

      await waitSpine();
      const spine = window.spine;

      const renderer = new spine.webgl.SceneRenderer(canvas, gl);
      const assetManager = new spine.webgl.AssetManager(gl, '/');

      renderer.resize(canvas.width, canvas.height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      rendererRef.current = renderer;

      await new Promise(resolve => {
        assetManager.loadText('spine.json', () => resolve());
      });

      await new Promise(resolve => {
        assetManager.loadTextureAtlas('spine.atlas', () => resolve());
      });

      const atlas = assetManager.get('spine.atlas');
      const jsonData = assetManager.get('spine.json');

      const skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas));
      const skeletonData = skeletonJson.readSkeletonData(JSON.parse(jsonData));

      const skeleton = new spine.Skeleton(skeletonData);

      if (skeletonData.skins.length > 1) {
        skeleton.setSkin(skeletonData.skins[1]);
        skeleton.setToSetupPose();
      }

      skeleton.x = 50;
      skeleton.y = -200;
      skeleton.scaleX = scale;
      skeleton.scaleY = scale;

      skeleton.updateWorldTransform();
      skeletonRef.current = skeleton;

      const stateData = new spine.AnimationStateData(skeletonData);
      const animationState = new spine.AnimationState(stateData);

      // 添加全局动画完成监听器
      animationState.addListener({
        complete: (trackEntry) => {
          const currentAnim = trackEntry.animation?.name;
          console.log('Animation complete:', currentAnim, 'isPlayingRef:', isPlayingRef.current, 'tomatoActive:', tomatoActiveRef.current);

          // 如果是emoji动画或touch hair/thinking完成，根据番茄钟状态返回对应默认动画
          if (currentAnim &&
            currentAnim !== 'standby/standby（slow）' &&
            currentAnim !== 'typing/typing') {
            setIsPlaying(false);
            isPlayingRef.current = false;

            // 番茄钟期间返回typing，否则返回standby
            if (tomatoActiveRef.current) {
              setCurrentAnimation('typing/typing');
              animationState.setAnimation(0, 'typing/typing', true);
            } else {
              setCurrentAnimation('standby/standby（slow）');
              animationState.setAnimation(0, 'standby/standby（slow）', true);
            }
          }

          // 如果是单次typing动画（非循环）完成，返回待机动画
          if (currentAnim === 'typing/typing' && !tomatoActiveRef.current) {
            setCurrentAnimation('standby/standby（slow）');
            animationState.setAnimation(0, 'standby/standby（slow）', true);
          }
        }
      });

      if (autoPlay) {
        animationState.setAnimation(0, 'standby/standby（slow）', true);
      }

      animationStateRef.current = animationState;

      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        renderer.begin();
        animationState.update(1 / 60 * 0.7);
        animationState.apply(skeleton);
        skeleton.updateWorldTransform();
        renderer.drawSkeleton(skeleton, false);
        renderer.end();
      };

      render();
    };

    loadSpine();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (canvasRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(canvasRef.current);
        } catch (e) { }
      }
    };
  }, [spineData, autoPlay]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => { setIsHovering(false); setIsDragging(false); }, []);
  const handleMouseDown = useCallback((e) => {
    if (e.target.className === 'drag-handle') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newPosition = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      setPosition(newPosition);
      savePosition(newPosition);
    }
  }, [isDragging, dragStart, savePosition]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const playAnimation = useCallback((animationName, loop = false) => {
    if (isPlayingRef.current || !animationStateRef.current) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    setCurrentAnimation(animationName);

    const animationState = animationStateRef.current;
    animationState.clearTracks();
    animationState.setAnimation(0, animationName, loop);
  }, []);

  // 专门用于设置默认循环动画（不设置isPlaying）
  const setDefaultAnimation = useCallback((animationName) => {
    if (!animationStateRef.current) return;
    
    setCurrentAnimation(animationName);
    const animationState = animationStateRef.current;
    animationState.clearTracks();
    animationState.setAnimation(0, animationName, true);
  }, []);

  const handleClick = useCallback(() => {
    if (isPlayingRef.current) return;

    // 随机触发emoji下的所有动画
    const animations = ['emoji/happy/happy', 'emoji/unhappy/unhappy', 'emoji/question/question', 'emoji/angry/angry'];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    playAnimation(animation);
  }, [playAnimation]);

  const startRandomAnimations = useCallback((isTomato = false) => {
    if (randomAnimationTimerRef.current) {
      clearInterval(randomAnimationTimerRef.current);
    }

    randomAnimationTimerRef.current = setInterval(() => {
      if (!isPlayingRef.current) {
        // 番茄钟期间随机穿插 touch hair 和 thinking 动画
        const animations = isTomato 
          ? ['touch hair/touchhair', 'thinking/thinking']
          : ['emoji/happy/happy', 'emoji/question/question'];
        const animation = animations[Math.floor(Math.random() * animations.length)];
        playAnimation(animation);
      }
    }, 10000);
  }, [playAnimation]);

  const stopRandomAnimations = useCallback(() => {
    if (randomAnimationTimerRef.current) {
      clearInterval(randomAnimationTimerRef.current);
      randomAnimationTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTomatoActive(isTomatoActive);
    tomatoActiveRef.current = isTomatoActive;
  }, [isTomatoActive]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (tomatoActive) {
      setDefaultAnimation('typing/typing'); // 使用setDefaultAnimation不设置isPlaying
      startRandomAnimations(true); // 番茄钟期间穿插 touch hair 和 thinking
    } else {
      stopRandomAnimations();
      setDefaultAnimation('standby/standby（slow）');
    }
  }, [tomatoActive, setDefaultAnimation, startRandomAnimations, stopRandomAnimations]);

  useEffect(() => {
    return () => {
      stopRandomAnimations();
    };
  }, [stopRandomAnimations]);

  // 监听键盘事件，检测打字
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 忽略一些特殊按键
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;

      // 如果当前没有在播放非循环动画，则切换到typing（只播放一次）
      if (!isPlayingRef.current && animationStateRef.current) {
        const currentAnim = animationStateRef.current.getCurrent(0)?.animation?.name;
        if (currentAnim !== 'typing/typing') {
          setCurrentAnimation('typing/typing');
          animationStateRef.current.setAnimation(0, 'typing/typing', false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '500px',
        height: '500px',
        zIndex: 1,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isHovering && (
        <div className="drag-handle" style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '20px', height: '20px', backgroundColor: '#898888',
          borderRadius: '50%', cursor: 'move', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '12px', fontWeight: 'bold', zIndex: 10
        }}>⋮⋮</div>
      )}
    </div>
  );
};

export default SpinePet;
