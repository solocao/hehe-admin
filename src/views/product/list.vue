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
          title: '商品',
          key: 'name',
          width: 200,
          render: (h, params) => {
            const row = params.row;
            console.log(row.title)
            const text = row.name
            const img_url = row.img_list[0]
            return h('div', {
              style: {
                textAlign: 'center',
                padding: '0px',
                height: '100px',
                width: '160px',
                border: '1px solid #80808040',
                borderRadius: '4px',
                background: 'url(' + img_url + ')',
                backgroundSize: 'cover'
              }
            }, text);
          }
        },
        {
          title: '品牌',
          key: 'category'
        },

        {
          title: '标签',
          key: 'tag',
          render: (h, params) => {
            const tags = []
            params.row.tag.forEach(x => {
              tags.push(h('Tag', x.name))
            })
            return h('div', tags);
          }

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
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    margin: '1px'

                  },
                  on: {
                    click: () => {
                      const { _id } = params.row
                      this.$router.push({
                        path: '/product/edit',
                        query: { product_id: _id }
                      });
                    }
                  }
                }, '编辑商品'),
                h('Button', {
                  props: {
                    type: 'warning',
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
                    type: 'primary',
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
                }, '查看商品')
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
    // 产品列表
    async productList() {
      const params = {
        url: 'product/list',
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
    this.productList()
  }
};
</script>

