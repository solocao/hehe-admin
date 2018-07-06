<template>
  <div style="background:white">
    <div style="marginBottom:4px;marginTop:4px">
      <ButtonGroup>
        <Button size='small'>全部</Button>
        <Button size='small' type="primary">已发布</Button>
        <Button size='small'>全部</Button>
        <Button size='small'>全部</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button size='small'>刷新</Button>
        <Button size='small' type="primary">清空搜索条件</Button>
        <Button size='small'>全部</Button>
        <Button size='small'>批量操作</Button>
      </ButtonGroup>
    </div>

    <Table :data="tableData1" :columns="tableColumns1" stripe ref="table2image"></Table>

  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData1: this.mockTableData1(),
      imageName: '',
      tableColumns1: [
        {
          title: '文章',
          key: 'title',
          width: 200,
          render: (h, params) => {
            const row = params.row;
            console.log(row.title)
            const text = row.title
            return h('div', {
              style: {
                textAlign: 'center',
                padding: '4px',
                height: '120px',
                width: '200px',
                background: 'url(http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png)',
                backgroundSize: 'cover'
              }
            }, text);
          }
        },
        {
          title: '分类目录',
          key: 'category'
        },
        {
          title: '标签',
          key: 'portrayal',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                title: params.row.portrayal.length + '个画像',
                placement: 'bottom'
              }
            }, [
                h('Tag', params.row.portrayal.length),
                h('div', {
                  slot: 'content'
                }, [
                    h('ul', this.tableData1[params.index].portrayal.map(item => {
                      return h('li', {
                        style: {
                          textAlign: 'center',
                          padding: '4px'
                        }
                      }, item);
                    }))
                  ])
              ]);
          }
        },
        {
          title: '标签',
          key: 'tag',

        },
        {
          title: '评论',
          key: 'comment',
        },
        {
          title: '喜欢',
          key: 'update'
        },
        {
          title: '日期',
          key: 'create_at'
        },
        {
          title: '状态',
          key: 'state'
        },
        {
          title: '操作',
          key: 'state',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column'
              }
            },
              [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '1px'

                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '编辑文章'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '1px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '移到草稿'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    margin: '1px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '移回收站'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    margin: '1px'
                  },
                  on: {
                    click: () => {
                      this.openPreview(params.row._id)
                    }
                  }
                }, '查看文章')
              ]);
          }
        }
      ]
    };
  },
  methods: {
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
    },
    // 打开文章预览
    openPreview(id) {
      this.$router.push({
        name: 'preview',
        params: {
          id: id,
        }
      })
    },
    async articleList() {
      const params = {
        url: 'article/list',
        payload: {}
      }
      const result = await this.post(params)
      console.log('看看结果')
      console.log(result)
      console.log(result.data)
      this.tableData1 = result.data

    }

  },
  mounted() {
    this.articleList()
  }
};
</script>

