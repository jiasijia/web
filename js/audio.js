var Optzer = function() {
	this.file = null;
	this.fileName = null;
	this.audioContext = null;
	this.source = null;
	this.sourceNode = null;
	this.gainNode = null;
	this.pauseTime = null;
}

Optzer.prototype = {
	_prepareApi: function() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		try {
			this.audioContext = new window.AudioContext();
		} catch(e) {
			console.log(e);
		}
	},
	_pickFile: function() {
		var that = this;
			input = document.getElementById('uploadedFile');

		input.onchange = function() {
			if(input.files.length > 0) {
				that.file = input.files[0];
				that.fileName = that.name;
				that._start();
			}
		}
	},
	_loadFile: function() {
		var that = this;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', "audio/dontyouworry.mp3", true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function() {
			that.file = xhr.response;
			that._start()
		}

		xhr.send();
	},
	_start: function() {
		var that = this,
			file = this.file,
			fr = new FileReader(),
			audioContext = that.audioContext;

		if (file.__proto__ == ArrayBuffer.prototype) {
			audioContext.decodeAudioData(file, function(buffer) {
				that._visualize(buffer);
			}, function(e) {
				console.log('解码失败');
			})
		} else {
			fr.onload = function(e) {
				var fileResult = e.target.result;

				audioContext.decodeAudioData(fileResult, function(buffer) {
					that._visualize(buffer);
				}, function(e) {
					console.log('解码失败');
				})
			}
			fr.readAsArrayBuffer(file);
		}
	},
	_visualize: function(buffer) {
		var that = this,
			audioContext = that.audioContext,
			audioBufferSourceNode = that.sourceNode = audioContext.createBufferSource(), 
			analyser = audioContext.createAnalyser(),
			gainNode = that.gainNode = audioContext.createGain();

		//buffer.duration 音频的持续时间
		//bufferNode可以直接连接destination，也可以连接gainNode和analyser，gainNode用来控制音量，analyser用来获取音频详细数据
		//这是一个持续输出
		audioBufferSourceNode.connect(analyser);
		analyser.connect(gainNode);
		gainNode.connect(audioContext.destination);
		audioBufferSourceNode.buffer = buffer;
		gainNode.gain.value = 0.1;
		//你可以使用source.start(10, 20, 30)来指定10秒后播放音频文件20秒到20 + 30秒之间的内容
		audioBufferSourceNode.start(0);

		that._drawRythm(analyser);
		that._stopEventListener();
		that._startEventListener();
		that._voiceControl();
	},
	_drawRythm: function(analyser) {
		var that = this,
			canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d'),
			cw = canvas.width,
			ch = canvas.height,
			meterWidth = 30, 						//方块宽度
			colGap = 5,  							//纵向间距
			rowGap = 5,  							//横向间距
			meterNum = cw / (meterWidth + rowGap), 	//柱条数量
			capArray = [],  						//存储上一次柱帽的位置，判断此次是下落还是在原地
			capStyle = '#f00', 						//键帽颜色
			capHeight = 5,     						//方块高度
			array = new Uint8Array(analyser.frequencyBinCount);

		canvas.style.left = (window.innerWidth - cw) / 2;
		canvas.style.top = (window.innerHeight - ch) / 2;

		var gradient = ctx.createLinearGradient(0, 30, 0, 350);
		gradient.addColorStop(1, '#0f0');
		gradient.addColorStop(0.7, '#ff0');
		gradient.addColorStop(0, '#f00');

		var render = function() {
			//AudioContext.currentTime 当前播放的时间点,它是一个精确的dobule数
			analyser.getByteFrequencyData(array);	

			var step = Math.round(array.length / meterNum);

			ctx.clearRect(0, 0, cw, ch);
			
			for (var i = 0; i < meterNum; i++) {
				var value = array[i * step];

				if (capArray.length < meterNum) {
					capArray.push(value);
				}
				value = value - value % (capHeight + colGap);
				ctx.fillStyle = capStyle;
				if (value < capArray[i]) {
					// 如果当前高度小于上一时刻的高度，应该缓缓落下
					ctx.fillRect(i * (meterWidth + rowGap), ch - (--capArray[i]) - capHeight - colGap, meterWidth, capHeight);
				} else {
					ctx.fillRect(i * (meterWidth + rowGap), ch - value - capHeight, meterWidth, capHeight);
					capArray[i] = value;
				}

				ctx.fillStyle = gradient;
				ctx.fillRect(i * (meterWidth + rowGap), ch - value, meterWidth, ch);
				var num = (value / (capHeight + colGap));
				for (var j = 1; j <= num; j++) {
					// ctx.fillRect(i * (meterWidth + rowGap), ch - (capHeight + colGap) * j, meterWidth, capHeight);
					ctx.clearRect(i * (meterWidth + rowGap), ch - (colGap + capHeight) * j, meterWidth, colGap);
				}
			}
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	},
	_stopEventListener() {
		var that = this
		document.getElementById('stop').onclick =  function() {
			// that.sourceNode.stop();
			that.pauseTime = that.audioContext.currentTime;
			that.audioContext.suspend()
		}
	},
	_startEventListener() {
		var that = this
		document.getElementById('start').onclick =  function() {
			// that.sourceNode.start(0, that.pauseTime);
			that.audioContext.resume();
		}
	},
	_voiceControl() {
		var gainNode = this.gainNode;
		document.getElementById('range').onchange = function() {
			gainNode.gain.value	= (this.value) / 100
		}
	},
	init: function() {
		this._prepareApi();
		this._loadFile();
	}
}

var opt = new Optzer();
opt.init();
