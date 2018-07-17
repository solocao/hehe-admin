<template>
  <div>
    <Card style="width:850px">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        我的图片
      </p>
      <Input size="small" slot="extra" v-model="search" icon="ios-search-strong" placeholder="Enter something..." style="width: 200px"></Input>
      <Row>
        <Col span="6">
        <Button type="primary">上传图片</Button>
        </Col>
        <Col span="18">
        <Input v-model="value11">
        <span slot="prepend">网络图片</span>
        <Button slot="append" @click="haha" type="primary">点击上传</Button>
        </Input>
        </Col>
      </Row>
      <Row v-if="false">
        <!-- <Col span="6">
        <div class="file-tree">
          <Tree :data="data5" :render="renderContent"></Tree>
        </div>
        </Col> -->
        <!-- <Col span="18"></Col> -->
      </Row>
      <Row style="height:700px;margin-top:10px">
        <ul class="file-img-list">
          <li class="img-item" v-for="i in 18">
            <div class="img-show">
              <img src="https://img.yzcdn.cn/upload_files/2018/07/06/FtDNUryxH9m8rDjNY9lbVW_VNIxb.png?imageView2/2/w/240/h/240/q/75/format/webp" alt="">
            </div>
            <div class="img-meta">
              400*34
            </div>
            <div class="img-title">
              ceshi.png
            </div>
            <div class="item-attach" v-if="false">
              <span>1</span>
            </div>
          </li>
        </ul>
        <Page :total="100"></Page>
      </Row>
    </Card>

  </div>
</template>
<script>
export default {
    data () {
        return {
            value11: '',
            search: '1231',
            data5: [
                {
                    title: 'parent 1',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        console.log('看看node');
                        console.log(node);
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            }, [
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: 'ios-plus-empty',
                                        type: 'primary'
                                    }),
                                    style: {
                                        width: '52px'
                                    },
                                    on: {
                                        click: () => { this.append(data); }
                                    }
                                })
                            ])
                        ]);
                    }
                    // children: [
                    //     {
                    //         title: 'child 1-1',
                    //         expand: true,
                    //         children: [
                    //             {
                    //                 title: 'leaf 1-1-1',
                    //                 expand: true
                    //             },
                    //             {
                    //                 title: 'leaf 1-1-2',
                    //                 expand: true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         title: 'child 1-2',
                    //         expand: true,
                    //         children: [
                    //             {
                    //                 title: 'leaf 1-2-1',
                    //                 expand: true
                    //             },
                    //             {
                    //                 title: 'leaf 1-2-1',
                    //                 expand: true
                    //             }
                    //         ]
                    //     }
                    // ]
                }
            ],
            buttonProps: {
                type: 'ghost',
                size: 'small'
            }
        };
    },
    methods: {
        haha () {
            alert('哈哈');
        },
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-folder-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => { this.append(data); }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        on: {
                            click: () => { this.remove(root, node, data); }
                        }
                    })
                ])
            ]);
        },
        append (data) {
            console.log('看看');
            console.log(data);
            const children = data.children || [];
            children.push({
                title: 'appended node',
                expand: true
            });
            this.$set(data, 'children', children);
        },
        remove (root, node, data) {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        }
    }
};
</script>

<style lang="stylus" scoped>
.file-tree {
  height: 600px;
  background: #EEEEEE;
}

.file-img-list {
  height: 500px;
  width: 100%;

  li {
    list-style: none;
  }

  .img-item {
    position: relative;
    float: left;
    width: 105px;
    height: 105px + 20px;
    margin-right: 10px;
    margin-bottom: 6px;
    cursor: pointer;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);

    .img-show {
      width: 105px;
      height: 105px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img-box {
    }

    .img-meta {
      position: absolute;
      bottom: 20px;
      width: 100%;
      background: #0000006e;
      color: white;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .item-attach {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 2px solid #2781EE;

      span {
        z-index: 2;
        position: absolute;
        right: 0;
        top: 0;
        padding-right: 1px;
        color: white;

        &:before {
          position: absolute;
          display: block;
          content: ' ';
          right: 0;
          top: 0;
          border: 14px solid #07d;
          border-left-color: transparent;
          border-bottom-color: transparent;
          z-index: -1;
        }
      }
    }
  }
}

.fc {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


