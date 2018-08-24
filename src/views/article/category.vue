<template>
  <div>
    <Row>
      <Col span="16">
      <Card>
        <p slot="title">
          <Icon type="paper-airplane"></Icon>
          分类管理
        </p>
        <tree-grid :items='data' :columns='columns' @on-row-click='rowClick' @on-selection-change='selectionClick' @on-sort-change='sortClick'></tree-grid>
      </Card>

      </Col>
      <Col span="8" class="padding-left-10">

      <Card>
        <p slot="title">
          <Icon type="paper-airplane"></Icon>
          编辑
        </p>
        <Form :model="categoryForm" label-position="top">
          <FormItem label="分类名称">
            <Input v-model="categoryForm.name"></Input>
          </FormItem>
          <FormItem label="分类别名">
            <Input v-model="categoryForm.slug"></Input>
          </FormItem>
          <FormItem label="分类描述">
            <Input type="textarea" v-model="categoryForm.description"></Input>
          </FormItem>
          <FormItem label="颜色">
            <Input type="textarea" v-model="categoryForm.color"></Input>
          </FormItem>
        </Form>
        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button" style="float:right">
            <Button @click="categoryEdit" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">确定</Button>
          </span>
        </Row>
      </Card>

      </Col>
    </Row>
  </div>
</template>
<script>
import TreeGrid from '../utils/TreeGrid.vue'
export default {
  components: {
    TreeGrid
  },
  data() {
    return {
      categoryMode: null,
      columns: [{
        type: 'selection',
        width: '50',
      }, {
        title: '分类名称',
        key: 'name',
        sortable: true,
        width: '150',
      }, {
        title: '文章数',
        key: 'name',
        width: '150',
      }, {
        title: '操作',
        type: 'action',
        actions: [{
          type: 'ghost',
          text: '编辑'
        }, {
          type: 'ghost',
          text: '删除'
        }, {
          type: 'ghost',
          text: '创建子分类'
        }],
        width: '150',
      }],
      data: null,
      tableData: [],
      imageName: '',
      categoryForm: {
        name: null,
        slug: null,
        description: null,
        color: null
      },
      tableColumns1: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '别名',
          key: 'slug'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'create_at'
        }
      ]
    };
  },
  methods: {
    async categoryList() {
      const params = {
        url: 'category/list',
        payload: {}
      }
      const result = await this.post(params)
      const data = result.data
      this.data = data
      console.log('看看结果')
      console.log(data)
    },
    // 添加分类
    async categoryAdd() {
      const params = {
        url: '/category/add',
        payload: {
          name: this.categoryForm.name,
          slug: this.categoryForm.slug,
          description: this.categoryForm.description
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.$Message.info(result.msg)
        this.categoryList()
      } else {
        this.$Message.warning(result.msg);
        (result.msg)
      }
    },
    // 分类更新
    async categoryUpdate() {
      // 去除无用的字段
      const formCopy = JSON.parse(JSON.stringify(this.categoryForm))
      Object.keys(formCopy).map(x => {
        if (formCopy[x] === null) {
          delete formCopy[x]
        }
      })
      const params = {
        url: 'category/update',
        payload: formCopy
      }
      const result = await this.post(params);
      this.categoryList();
      console.log(result)
    },
    // 编辑事件的总代理
    categoryEdit() {
      if (this.categoryMode === 'update') {
        this.categoryUpdate()
      }

    },


    rowClick(data, index, event, text) {
      // alert(text)
      if (text === '编辑') {
        this.categoryMode = 'update'
      }
      console.log('当前行数据:')
      console.log(data)
      const { name, slug, description, _id } = data
      this.categoryForm._id = _id;
      this.categoryForm.name = name;
      this.categoryForm.slug = slug;
      this.categoryForm.description = description;
      console.log('点击行号:' + index)
      console.log('点击事件:' + event)
    },
    rowAddChildren(data, index, event) {
      alert('点击成功')
      console.log('当前行数据:' + data)
      console.log('点击行号:' + index)
      console.log('点击事件:' + event)
    },
    selectionClick(arr) {
      console.log('选中数据id数组:' + arr)
    },
    sortClick(key, type) {
      console.log('排序字段:' + key)
      console.log('排序规则:' + type)
    },
    async taglist() {
      const params = {
        url: '/tag/list',
        payload: {

        }
      }
      const result = await this.post(params)
      this.tableData = result.data
      console.log('看看标签')
      console.log(result)
    },
    // 创建标签
    async tagAdd() {
      const params = {
        url: '/tag/add',
        payload: {
          name: this.tagForm.name,
          slug: this.tagForm.slug,
          description: this.tagForm.description
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.$Message.info(result.msg)
        this.taglist()
      } else {
        this.$Message.console.warn(result.msg);
        (result.msg)
      }
    },
    mockTableData1() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          name: '商圈' + Math.floor(Math.random() * 100 + 1),
          status: Math.floor(Math.random() * 3 + 1),
          portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
          people: [
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            }
          ],
          time: Math.floor(Math.random() * 7 + 1),
          update: new Date()
        });
      }
      return data;
    },
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    }

  },
  mounted() {
    this.taglist()
    this.categoryList()
  }
};
</script>

<style lang="stylus">
@import './category.styl';
</style>


