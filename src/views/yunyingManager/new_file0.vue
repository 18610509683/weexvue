<template>
	<div>
		<h3>饿了么ui选择器初始化值案例</h3>
		<el-button @click="up">开始赋值</el-button>
		<!--<el-select multiple v-model="value" placeholder="请选择产品大类" style="width: 100%" filterable value-key="pcode" @change="clicked">
			<el-option v-for="item in options" :key="item.pcode" :label="item.pname" :value="item" />
		</el-select>-->
		<el-select multiple v-model="value" placeholder="请选择产品大类" style="width: 100%" filterable @change="clicked">
			<el-option v-for="item in options" :key="item.pcode" :label="item.pname" :value="item.pcode" />
		</el-select>
	</div>

</template>

<script>
	export default {
		name: "HelloWorld",
		created() {
			// 这里可以用于获取父组件的表单数据
			// this.value = 10; // options中是字符串类型，设置为数字类型时，就会出现我START说的那种问题.
			//			this.value = "10";
		},
		data() {
			return {
				value: [],
				options: [{
						pcode: "10",
						pname: "黄金糕",
					},
					{
						pcode: "100",
						pname: "双皮奶",
					},
					{
						pcode: "1000",
						pname: "蚵仔煎",
					},
					{
						pcode: "10000",
						pname: "龙须面",
					},
					{
						pcode: "100000",
						pname: "北京烤鸭",
					},
				]
			};
		},
		created() {
			//			this.value.push({
			//				pcode: "100000",
			//				pname: "北京烤鸭",
			//			})
			this.value.push('10')
		},
		methods: {
			clicked(obj) {
				console.log(obj)
			},
			// 我这里是demo，所以写的是点击事件，直接写个调用获取选项的接口即可，效果是一样的。
			up() {
				this.value.push('100')
				//				this.options = [{
				//						pcode: "10",
				//						pname: "黄金糕",
				//					},
				//					{
				//						pcode: "100",
				//						pname: "双皮奶",
				//					},
				//					{
				//						pcode: "1000",
				//						pname: "蚵仔煎",
				//					},
				//					{
				//						pcode: "10000",
				//						pname: "龙须面",
				//					},
				//					{
				//						pcode: "100000",
				//						pname: "北京烤鸭",
				//					},
				//				]
			},
		},
	}
</script>