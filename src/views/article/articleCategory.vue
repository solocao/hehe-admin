<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          文章分类
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="categoryModalAdd(null)">新增</Button>
          <Button size="small" type="ghost" @click="categoryList">刷新</Button>
        </div>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="categoryModal" :title="categoryMode==='add'?'新增分类':'更新分类'" @on-ok="ok" @on-cancel="cancel">
      <Form :model="form" label-position="left" :label-width="100">
        <FormItem label="分类名称">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="分类别名">
          <Input v-model="form.slug"></Input>
        </FormItem>
        <FormItem label="分类描述">
          <Input v-model="form.description"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryColumns: [
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            const row = params.row
            return (<div class="tree-list">
              <span class={'level' + row.level}>
                <icon type="arrow-down-b"></icon>
                <icon class="category-icon" type="ios-list-outline"></icon>
              </span>
              <span>
                {row.name}
              </span>
            </div>)
          }
        },
        {
          title: '描述',
          key: 'description',
        },
        {
          title: '标识id',
          key: '_id',
        },
        {
          title: '操作',
          key: 'state',
          width: 200,
          render: (h, params) => {
            const row = params.row
            return (<div class="a-fc">
              <i-button size="small" title='查看' onClick={() => this.categoryModalUpdate(row)}>编辑分类</i-button>
              <i-button size="small" title='查看' onClick={() => this.categoryModalAdd(row._id)}>新建子分类</i-button>
            </div >)
          }
        }

      ],
      categoryData: [],
      categoryModal: false,
      categoryMode: null,
      form: {
        _id: null,
        name: null,
        slug: null,
        description: null
      }
    };
  },
  methods: {
    // 打开新增模态框
    categoryModalAdd(pid) {
      this.categoryModal = true;
      if (pid === null) {
        this.categoryMode = 'add'
      } else {
        this.categoryMode = 'add_sub'
      }
      this.form.pid = pid
    },
    // 更新
    categoryModalUpdate(form) {
      console.log(form)
      this.categoryModal = true;
      this.categoryMode = 'update';
      const { name, slug, description, _id } = form;
      this.form._id = _id;
      this.form.name = name;
      this.form.slug = slug;
      this.form.description = description;
    },
    ok() {
      if (this.categoryMode === 'add' || this.categoryMode === 'add_sub') {
        this.categoryAdd()
      }
      if (this.categoryMode === 'update') {
        this.categoryUpdate()
      }
    },
    // 添加分类
    async categoryAdd() {
      const formCopy = JSON.parse(JSON.stringify(this.form))
      delete formCopy._id
      if (this.categoryMode === 'add') {
        delete formCopy.pid
      }
      const params = {
        url: '/category/add',
        payload: formCopy,
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.$Message.info(result.msg)
        this.categoryList()
      } else {
        this.$Message.warning(result.msg);
      }
    },
    // 分类更新
    async categoryUpdate() {
      // 去除无用的字段
      const formCopy = JSON.parse(JSON.stringify(this.form))
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
    // ceshiloader() {
    //   this.$Loading.destroy()
    //   this.$Loading.config({
    //     color: '#EE603A',
    //     failedColor: '#EE603A',
    //     height: 10
    //   });
    //   this.$Loading.start();
    // },
    cancel() {

    },
    async categoryList() {
      const params = {
        url: 'category/list',
        payload: {}
      }
      const result = await this.post(params)
      this.categoryData = this.initData(result.data, 1, null)
      console.log('看看你的魅力值')
      console.log(this.categoryData)
    },
    initData(items, level, parent) {
      let initItems = [];
      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          'parent': parent,
          'level': level,
        });
        if ((typeof item.expanded) === 'undefined') {
          item = Object.assign({}, item, {
            'expanded': false
          });
        }
        if ((typeof item.show) === 'undefined') {
          item = Object.assign({}, item, {
            'isShow': false
          });
        }
        if ((typeof item.isChecked) === 'undefined') {
          item = Object.assign({}, item, {
            'isChecked': false
          });
        }
        item = Object.assign({}, item, {
          'load': (!!item.expanded)
        });
        initItems.push(item);
        if (item.children) {
          const insertIndex = initItems.findIndex(x => x._id === item._id);
          if (insertIndex > -1) {
            const childItems = this.initData(item.children, level + 1, item._id)
            initItems.splice(insertIndex + 1, 0, ...childItems)
          }
        }
      });
      return initItems
    }
  },
  mounted() {
    this.categoryList()

  }


};
</script>

<style lang="less">
.tree-list {
  display: flex;
  .category-icon {
    margin-left: 6px;
    margin-right: 2px;
  }
  .level1 {
    width: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .level2 {
    width: 45px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .level3 {
    width: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.a-fc {
  display: flex;
  align-items: center;
}
</style>



