<template>
  <div class="node-donate-container">
    <NCard title="节点捐赠" class="donate-card">
      <template #header-extra>
        <NSpace>
          <NButton type="primary" @click="showGuide = true">
            <template #icon>
              <NIcon><help-circle-outline /></NIcon>
            </template>
            捐赠指南
          </NButton>
        </NSpace>
      </template>

      <NTabs type="line" animated v-model:value="activeTab">
        <NTabPane name="apply" tab="新的申请">
          <NAlert type="info" title="节点捐赠说明" style="margin-bottom: 16px">
            <template #icon>
              <NIcon>
                <InformationCircleOutline />
              </NIcon>
            </template>
            感谢您愿意为 ME Frp 贡献节点资源！请填写以下表单提交您的节点信息。<br>
            我们将在审核通过后将您的节点添加到系统中, 并为您提供相应的权益。
          </NAlert>

          <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="medium">
            <NFormItem label="节点名称" path="nodeName">
              <NInput v-model:value="formValue.nodeName" placeholder="请输入节点名称" />
              <template #feedback>
                <div class="form-tip">节点名称应遵循 "国家/地区 序号①②③④⑤⑥⑦⑧⑨⑩ 带宽" 的格式, 例如: "中国/北京 ① 100Mbps"</div>
              </template>
            </NFormItem>

            <NFormItem label="主机名/IP" path="hostname">
              <NInput v-model:value="formValue.hostname" placeholder="请输入主机名或IP地址" />
              <template #feedback>
                <div class="form-tip">可以是域名或 IP 地址, 确保可以从公网访问</div>
              </template>
            </NFormItem>

            <NFormItem label="节点描述" path="description">
              <NInput v-model:value="formValue.description" type="textarea" placeholder="请输入节点描述" />
              <template #feedback>
                <div class="form-tip">简单描述节点的特点、网络类型、等信息</div>
              </template>
            </NFormItem>

            <NFormItem label="服务端口" path="servicePort">
              <NInputNumber v-model:value="formValue.servicePort" :min="1" :max="65535" placeholder="请输入服务端口" />
              <template #feedback>
                <div class="form-tip">Frp 服务端口 (用于客户端连接), 确保该端口已在防火墙中开放</div>
              </template>
            </NFormItem>

            <NFormItem label="管理端口" path="adminPort">
              <NInputNumber v-model:value="formValue.adminPort" :min="1" :max="65535" placeholder="请输入管理端口" />
              <template #feedback>
                <div class="form-tip">Frp 管理面板端口 (用于管理员监控), 确保该端口已在防火墙中开放</div>
              </template>
            </NFormItem>

            <NFormItem label="管理密码" path="adminPass">
              <div style="display: flex; gap: 8px; width: 100%;">
                <NInput v-model:value="formValue.adminPass" type="password" placeholder="请输入管理密码"
                  show-password-on="click" style="flex-grow: 1;" />
                <NButton type="primary" @click="generateRandomPassword" :loading="generatingPassword">
                  生成密码
                </NButton>
                <NButton v-if="formValue.adminPass" @click="copyPassword" :disabled="generatingPassword">
                  <template #icon>
                    <NIcon>
                      <CopyOutline />
                    </NIcon>
                  </template>
                  复制
                </NButton>
              </div>
              <div class="password-strength" style="margin-top: 12px;">
                <div class="strength-bar">
                  <div class="strength-level"
                    :style="{ width: `${passwordStrength.percent}%`, backgroundColor: passwordStrength.color }"></div>
                </div>
                <div class="strength-text" :style="{ color: passwordStrength.color }">
                  密码强度: {{ passwordStrength.label }}
                </div>
              </div>
              <template #feedback>
                <div class="form-tip">设置管理面板的访问密码, 建议使用32位以上的强密码。</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的用户组" path="allowGroup">
              <NButtonGroup>
                <NButton v-for="group in groupOptions" :key="group.value"
                  :type="formValue.allowGroup.includes(group.value) ? 'primary' : 'default'"
                  :disabled="group.value === 'admin' || group.value === 'sponsor'" @click="toggleGroup(group.value)">
                  {{ group.label }}
                </NButton>
              </NButtonGroup>
              <template #feedback>
                <div class="form-tip">选择允许使用此节点的用户组, 管理员、赞助者组始终启用</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的端口范围" path="allowPort">
              <NInput v-model:value="formValue.allowPort" placeholder="例如: 10000-50000" />
              <template #feedback>
                <div class="form-tip">设置允许用户使用的端口范围, 格式如 "10000-50000"。不要把服务端口和管理端口包含在内！</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的隧道类型" path="allowType">
              <NButtonGroup>
                <NButton v-for="protocol in typeOptions" :key="protocol.value"
                  :type="formValue.allowType.includes(protocol.value) ? 'primary' : 'default'"
                  @click="toggleProtocol(protocol.value)">
                  {{ protocol.label }}
                </NButton>
              </NButtonGroup>
              <template #feedback>
                <div class="form-tip">选择允许的隧道协议</div>
              </template>
            </NFormItem>

            <NFormItem>
              <NButton type="primary" @click="handleSubmit" :loading="submitting">
                提交申请
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>

        <NTabPane name="list" tab="我的申请">
          <NAlert v-if="donateList.length === 0 && !loading" type="info" title="暂无申请记录" style="margin-bottom: 16px">
            您还没有提交过节点捐赠申请, 可以在"申请捐赠"标签页提交申请。
          </NAlert>

          <NDataTable :columns="columns" :data="donateList" :loading="loading" :pagination="pagination"
            :bordered="false" striped />
        </NTabPane>

        <NTabPane name="delete" tab="删除节点申请">
          <NAlert type="warning" title="删除节点说明" style="margin-bottom: 16px">
            <template #icon>
              <NIcon>
                <WarningOutline />
              </NIcon>
            </template>
            删除节点将会移除所有与该节点相关的隧道, 请谨慎操作。<br>
            只有您捐赠且已通过审核的节点才能申请删除。<br>
            删除申请需要管理员审核, 审核通过后节点将被永久删除。
          </NAlert>

          <NForm ref="deleteFormRef" :model="deleteFormValue" :rules="deleteRules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" size="medium">
            <NFormItem label="选择节点" path="nodeId">
              <NSelect v-model:value="deleteFormValue.nodeId" :options="nodeOptions" placeholder="请选择要删除的节点"
                :loading="nodesLoading" :disabled="nodesLoading || nodeOptions.length === 0" clearable
                value-field="value" label-field="label" />
              <template #feedback>
                <div class="form-tip" v-if="nodeOptions.length === 0 && !nodesLoading">您目前没有已通过审核的捐赠节点可删除, 请先捐赠节点并等待审核通过
                </div>
                <div class="form-tip" v-else>选择您要申请删除的节点（仅显示您捐赠且已通过审核的节点）</div>
              </template>
            </NFormItem>

            <NFormItem label="删除原因" path="reason">
              <NInput v-model:value="deleteFormValue.reason" type="textarea" placeholder="请输入删除原因" />
              <template #feedback>
                <div class="form-tip">请详细说明删除原因, 以便管理员审核</div>
              </template>
            </NFormItem>

            <NFormItem>
              <NButton type="error" @click="handleDeleteSubmit" :loading="deleteSubmitting"
                :disabled="nodesLoading || nodeOptions.length === 0">
                申请删除
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>

        <NTabPane name="deleteList" tab="删除申请列表">
          <NAlert v-if="deleteList.length === 0 && !deleteLoading" type="info" title="暂无删除申请记录"
            style="margin-bottom: 16px">
            您还没有提交过节点删除申请, 可以在"申请删除节点"标签页提交申请。
          </NAlert>

          <NDataTable :columns="deleteColumns" :data="deleteList" :loading="deleteLoading"
            :pagination="deletePagination" :bordered="false" striped />
        </NTabPane>

        <NTabPane name="edit" tab="编辑节点申请">
          <NAlert type="info" title="编辑节点说明" style="margin-bottom: 16px">
            <template #icon>
              <NIcon>
                <InformationCircleOutline />
              </NIcon>
            </template>
            您可以申请编辑已通过审核的节点信息。<br>
            编辑申请需要管理员审核, 审核通过后节点信息将被更新。
          </NAlert>

          <NForm ref="editFormRef" :model="editFormValue" :rules="editRules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="medium">
            <NFormItem label="选择节点" path="nodeId">
              <NSelect v-model:value="editFormValue.nodeId" :options="nodeOptions" placeholder="请选择要编辑的节点"
                :loading="nodesLoading" :disabled="nodesLoading || nodeOptions.length === 0" clearable
                value-field="value" label-field="label" @update:value="handleNodeSelect" />
              <template #feedback>
                <div class="form-tip" v-if="nodeOptions.length === 0 && !nodesLoading">您目前没有已通过审核的捐赠节点可编辑, 请先捐赠节点并等待审核通过
                </div>
                <div class="form-tip" v-else>选择您要申请编辑的节点（仅显示您捐赠且已通过审核的节点）</div>
              </template>
            </NFormItem>

            <NFormItem label="节点名称" path="nodeName">
              <NInput v-model:value="editFormValue.nodeName" placeholder="请输入节点名称" />
              <template #feedback>
                <div class="form-tip">节点名称应遵循 "国家/地区 序号①②③④⑤⑥⑦⑧⑨⑩ 带宽" 的格式, 例如: "中国/北京 ① 100Mbps"</div>
              </template>
            </NFormItem>

            <NFormItem label="主机名/IP" path="hostname">
              <NInput v-model:value="editFormValue.hostname" placeholder="请输入主机名或IP地址" />
              <template #feedback>
                <div class="form-tip">可以是域名或 IP 地址, 确保可以从公网访问</div>
              </template>
            </NFormItem>

            <NFormItem label="节点描述" path="description">
              <NInput v-model:value="editFormValue.description" type="textarea" placeholder="请输入节点描述" />
              <template #feedback>
                <div class="form-tip">简单描述节点的特点、网络类型、等信息</div>
              </template>
            </NFormItem>

            <NFormItem label="服务端口" path="servicePort">
              <NInputNumber v-model:value="editFormValue.servicePort" :min="1" :max="65535" placeholder="请输入服务端口" />
              <template #feedback>
                <div class="form-tip">Frp 服务端口 (用于客户端连接), 确保该端口已在防火墙中开放</div>
              </template>
            </NFormItem>

            <NFormItem label="管理端口" path="adminPort">
              <NInputNumber v-model:value="editFormValue.adminPort" :min="1" :max="65535" placeholder="请输入管理端口" />
              <template #feedback>
                <div class="form-tip">Frp 管理面板端口 (用于管理员监控), 确保该端口已在防火墙中开放</div>
              </template>
            </NFormItem>

            <NFormItem label="管理密码" path="adminPass">
              <div style="display: flex; gap: 8px; width: 100%;">
                <NInput v-model:value="editFormValue.adminPass" type="password" placeholder="请输入管理密码"
                  show-password-on="click" style="flex-grow: 1;" />
                <NButton type="primary" @click="generateEditPassword" :loading="generatingPassword">
                  生成密码
                </NButton>
                <NButton v-if="editFormValue.adminPass" @click="copyEditPassword" :disabled="generatingPassword">
                  <template #icon>
                    <NIcon>
                      <CopyOutline />
                    </NIcon>
                  </template>
                  复制
                </NButton>
              </div>
              <template #feedback>
                <div class="form-tip">设置管理面板的访问密码, 建议使用32位以上的强密码。</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的用户组" path="allowGroup">
              <NButtonGroup>
                <NButton v-for="group in groupOptions" :key="group.value"
                  :type="editFormValue.allowGroup.includes(group.value) ? 'primary' : 'default'"
                  :disabled="group.value === 'admin' || group.value === 'sponsor'"
                  @click="toggleEditGroup(group.value)">
                  {{ group.label }}
                </NButton>
              </NButtonGroup>
              <template #feedback>
                <div class="form-tip">选择允许使用此节点的用户组, 管理员、赞助者组始终启用</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的端口范围" path="allowPort">
              <NInput v-model:value="editFormValue.allowPort" placeholder="例如: 10000-50000" />
              <template #feedback>
                <div class="form-tip">设置允许用户使用的端口范围, 格式如 "10000-50000"。不要把服务端口和管理端口包含在内！</div>
              </template>
            </NFormItem>

            <NFormItem label="允许的隧道类型" path="allowType">
              <NButtonGroup>
                <NButton v-for="protocol in typeOptions" :key="protocol.value"
                  :type="editFormValue.allowType.includes(protocol.value) ? 'primary' : 'default'"
                  @click="toggleEditProtocol(protocol.value)">
                  {{ protocol.label }}
                </NButton>
              </NButtonGroup>
              <template #feedback>
                <div class="form-tip">选择允许的隧道协议</div>
              </template>
            </NFormItem>

            <NFormItem label="修改原因" path="reason">
              <NInput v-model:value="editFormValue.reason" type="textarea" placeholder="请输入修改原因" />
              <template #feedback>
                <div class="form-tip">请详细说明修改原因, 以便管理员审核</div>
              </template>
            </NFormItem>

            <NFormItem>
              <NButton type="primary" @click="handleEditSubmit" :loading="editSubmitting"
                :disabled="nodesLoading || nodeOptions.length === 0">
                提交编辑申请
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>

        <NTabPane name="editList" tab="编辑申请列表">
          <NAlert v-if="editList.length === 0 && !editLoading" type="info" title="暂无编辑申请记录" style="margin-bottom: 16px">
            您还没有提交过节点编辑申请, 可以在"编辑节点申请"标签页提交申请。
          </NAlert>

          <NDataTable :columns="editColumns" :data="editList" :loading="editLoading" :pagination="editPagination"
            :bordered="false" striped />
        </NTabPane>

        <NTabPane name="scripts" tab="安装脚本">
          <NAlert type="info" title="节点安装脚本" style="margin-bottom: 16px">
            <template #icon>
              <NIcon>
                <InformationCircleOutline />
              </NIcon>
            </template>
            您可以在此获取节点的安装脚本, 用于在服务器上部署 ME Frp 节点。<br>
            脚本生成后有效期为 24 小时, 请在有效期内使用。<br>
            请选择节点、系统类型和架构, 然后点击"生成脚本"按钮。
          </NAlert>

          <NForm ref="scriptFormRef" :model="scriptFormValue" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="medium">
            <NFormItem label="选择节点" path="nodeId">
              <NSelect v-model:value="scriptFormValue.nodeId" :options="nodeOptions" placeholder="请选择节点"
                :loading="nodesLoading" :disabled="nodesLoading || nodeOptions.length === 0" clearable
                value-field="value" label-field="label" />
              <template #feedback>
                <div class="form-tip" v-if="nodeOptions.length === 0 && !nodesLoading">您目前没有已通过审核的捐赠节点, 请先捐赠节点并等待审核通过</div>
                <div class="form-tip" v-else>选择您要生成安装脚本的节点（仅显示您捐赠且已通过审核的节点）</div>
              </template>
            </NFormItem>

            <NFormItem label="系统类型" path="system" :rule="{ required: true, message: '请选择系统类型', trigger: ['blur', 'change'] }">
              <NRadioGroup v-model:value="scriptFormValue.system">
                <NRadio value="linux">Linux</NRadio>
                <NRadio value="windows">Windows</NRadio>
              </NRadioGroup>
              <template #feedback>
                <div class="form-tip">选择服务器的操作系统类型</div>
              </template>
            </NFormItem>

            <NFormItem label="系统架构" path="arch" :rule="{ required: true, message: '请选择系统架构', trigger: ['blur', 'change'] }">
              <NSelect v-model:value="scriptFormValue.arch" :options="archOptions" placeholder="请选择系统架构" 
                :loading="loadingArchs" :disabled="loadingArchs || archOptions.length === 0" clearable />
              <template #feedback>
                <div class="form-tip" v-if="loadingArchs">正在加载系统架构信息...</div>
                <div class="form-tip" v-else-if="archOptions.length === 0">当前系统类型没有可用的架构</div>
                <div class="form-tip" v-else>选择服务器的系统架构, 如不确定请咨询服务器提供商</div>
              </template>
            </NFormItem>

            <NFormItem>
              <NButton type="primary" @click="handleGenerateScript" :loading="generatingScript" :disabled="nodesLoading || nodeOptions.length === 0">
                生成脚本
              </NButton>
            </NFormItem>
          </NForm>

          <NDivider v-if="scriptInfo" style="margin: 24px 0" />

          <div v-if="scriptInfo" class="script-info">
            <NAlert type="success" title="脚本生成成功" style="margin-bottom: 16px">
              <template #icon>
                <NIcon>
                  <CheckmarkCircleOutline />
                </NIcon>
              </template>
              脚本已生成, 有效期至 {{ new Date(scriptInfo.expireTime * 1000).toLocaleString() }}。<br>
              您可以点击下方按钮下载脚本, 或者直接复制下载链接或一键安装命令。
            </NAlert>

            <NSpace vertical>
              <NSpace vertical size="small">
                <div>下载链接：</div>
                <NInput v-model:value="scriptDownloadUrl" readonly>
                  <template #suffix>
                    <NButton quaternary circle @click="copyScriptUrl">
                      <template #icon>
                        <NIcon>
                          <CopyOutline />
                        </NIcon>
                      </template>
                    </NButton>
                  </template>
                </NInput>
              </NSpace>

              <NSpace vertical size="small">
                <div>一键安装命令：</div>
                <NInput v-model:value="getInstallCommand" readonly>
                  <template #suffix>
                    <NButton quaternary circle @click="copyInstallCommand">
                      <template #icon>
                        <NIcon>
                          <CopyOutline />
                        </NIcon>
                      </template>
                    </NButton>
                  </template>
                </NInput>
              </NSpace>

              <NSpace>
                <NButton type="primary" @click="downloadScript">
                  <template #icon>
                    <NIcon>
                      <DownloadOutline />
                    </NIcon>
                  </template>
                  下载脚本
                </NButton>
                <NButton @click="resetScriptForm">
                  重置
                </NButton>
              </NSpace>
            </NSpace>
          </div>
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- 捐赠指南对话框 -->
    <NModal v-model:show="showGuide" preset="card" title="节点捐赠指南" style="max-width: 650px">
      节点捐赠是 ME Frp 社区发展的重要支持方式。通过捐赠节点, 您可以：<br>
      - 帮助更多用户获得优质的内网穿透服务<br>
      - 提升 ME Frp 的整体服务质量和覆盖范围<br>
      - 获得特殊权益和社区荣誉<br>
      <br>
      <h3>节点要求</h3>
      为确保服务质量, 捐赠节点需满足以下基本要求：<br>
      - 稳定的网络连接和足够的带宽（建议至少 10Mbps 上行带宽）<br>
      - 7x24 小时在线运行能力<br>
      - 公网 IP 或可靠的域名解析<br>
      - 支持 TCP/UDP 等隧道协议能力<br>
      <br>
      <h3>捐赠流程</h3>
      - 填写并提交节点捐赠申请<br>
      - 管理员审核申请（通常在 1-3 个工作日内完成）<br>
      - 审核通过后, 节点将自动添加到系统中<br>
      - 节点上线后, 可以在节点列表中看到您捐赠的节点<br>
      <br>
      <h3>捐赠者权益</h3>
      作为节点捐赠者, 您将获得以下权益：<br>
      - 账户升级为赞助者用户组, 享受更高的带宽和更多的隧道数量<br>
      - 在节点列表中显示您的名字（如果您愿意）<br>
      - 优先的技术支持服务<br>
      - 社区荣誉和感谢<br>
      <br>
      <h3>注意事项</h3>
      请确保您的节点符合上述要求, 并保持良好的运行状态。<br>
      管理员有权根据实际情况调整节点状态, 包括但不限于带宽限制、节点下线等。<br>
      请勿滥用赞助者权益, 否则可能会导致您的赞助者资格被取消。<br>
      感谢您的支持, 让我们共同推动 ME Frp 社区的发展！

      <template #footer>
        <NButton type="primary" @click="showGuide = false">我知道了</NButton>
      </template>
    </NModal>

    <!-- 节点详情对话框 -->
    <NModal v-model:show="showDetail" preset="dialog" style="width: 650px; max-width: 90vw">
      <template #header>
        <div class="modal-header">节点详情</div>
      </template>
      <div v-if="currentDonate" style="padding: 16px 0">
        <div class="modal-section">
          <div class="section-title">基本信息</div>
          <div class="modal-info-item">
            <span class="label">申请ID：</span>
            <span class="value">{{ currentDonate.donateId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ currentDonate.username }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点名称：</span>
            <span class="value">{{ currentDonate.nodeName }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">主机名/IP：</span>
            <span class="value">{{ currentDonate.hostname }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点描述：</span>
            <span class="value">{{ currentDonate.description }}</span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">配置信息</div>
          <div class="modal-info-item">
            <span class="label">服务端口：</span>
            <span class="value">{{ currentDonate.servicePort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理端口：</span>
            <span class="value">{{ currentDonate.adminPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理密码：</span>
            <span class="value">{{ currentDonate.adminPass }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的用户组：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentDonate.allowGroup">
                  <NTag v-for="group in currentDonate.allowGroup.split(';')" :key="group" type="info" size="small">
                    {{ getGroupName(group) }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的端口范围：</span>
            <span class="value">{{ currentDonate.allowPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的隧道类型：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentDonate.allowType">
                  <NTag v-for="type in currentDonate.allowType.split(';')" :key="type" type="success" size="small">
                    {{ type.toUpperCase() }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">申请状态</div>
          <div class="modal-info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ new Date(currentDonate.applyTime * 1000).toLocaleString() }}</span>
          </div>
          <div class="modal-info-item" v-if="currentDonate.status !== 0">
            <span class="label">审核时间：</span>
            <span class="value">{{ currentDonate.reviewTime ? new Date(currentDonate.reviewTime * 1000).toLocaleString()
              :
              '-' }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">状态：</span>
            <span class="value">
              <NTag :type="currentDonate.status === 0 ? 'warning' : (currentDonate.status === 1 ? 'success' : 'error')"
                size="small">
                {{ currentDonate.status === 0 ? '待审核' : (currentDonate.status === 1 ? '已通过' : '已拒绝') }}
              </NTag>
            </span>
          </div>
          <div class="modal-info-item" v-if="currentDonate.status === 2">
            <span class="label">拒绝原因：</span>
            <span class="value">{{ currentDonate.rejectReason || '-' }}</span>
          </div>
        </div>
      </div>
      <template #action>
        <NButton size="small" @click="showDetail = false">关闭</NButton>
      </template>
    </NModal>

    <!-- 删除申请详情对话框 -->
    <NModal v-model:show="showDeleteDetail" preset="dialog" style="width: 650px; max-width: 90vw">
      <template #header>
        <div class="modal-header">删除申请详情</div>
      </template>
      <div v-if="currentDeleteRequest" style="padding: 16px 0">
        <div class="modal-section">
          <div class="section-title">基本信息</div>
          <div class="modal-info-item">
            <span class="label">申请ID：</span>
            <span class="value">{{ currentDeleteRequest.requestId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ currentDeleteRequest.username }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点ID：</span>
            <span class="value">
              <NTag type="info" size="small">{{ currentDeleteRequest.nodeId }}</NTag>
            </span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">删除信息</div>
          <div class="modal-info-item">
            <span class="label">删除原因：</span>
            <span class="value">{{ currentDeleteRequest.reason }}</span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">申请状态</div>
          <div class="modal-info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ new Date(currentDeleteRequest.applyTime * 1000).toLocaleString() }}</span>
          </div>
          <div class="modal-info-item" v-if="currentDeleteRequest.status !== 0">
            <span class="label">审核时间：</span>
            <span class="value">{{ currentDeleteRequest.reviewTime ? new Date(currentDeleteRequest.reviewTime *
              1000).toLocaleString() : '-' }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">状态：</span>
            <span class="value">
              <NTag :type="getStatusType(currentDeleteRequest.status)" size="small">
                {{ getStatusText(currentDeleteRequest.status) }}
              </NTag>
            </span>
          </div>
          <div v-if="currentDeleteRequest.status === 2" class="modal-info-item">
            <span class="label">拒绝原因：</span>
            <span class="value">{{ currentDeleteRequest.rejectReason || '-' }}</span>
          </div>
        </div>
      </div>
      <template #action>
        <NButton size="small" @click="showDeleteDetail = false">关闭</NButton>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h, watch, computed } from 'vue'
import {
  useMessage, NButton, NCard, NAlert, NForm, NFormItem, NInput, NInputNumber, NSelect, NTabs, NTabPane, NSpace, NIcon, NDataTable, NModal, NDivider, FormInst, PaginationProps, SelectOption, NButtonGroup, NTag, NRadioGroup, NRadio
} from 'naive-ui'
import {
  applyNodeDonate,
  getUserNodeDonates,
  applyNodeDelete,
  getUserNodeDeleteRequests,
  applyNodeEdit,
  getUserNodeEditRequests,
  getNodeInstallScript,
} from '../../../shared/api/nodeDonate'
import { AuthApi } from '../../../shared/api/auth'
import type { NodeDonate, NodeDeleteRequest, NodeEditRequest, UserGroup, GetNodeInstallScriptResponse } from '../../../types/authApi'
import type { Product } from '../../../types/adminApi'
import {
  HelpCircleOutline,
  InformationCircleOutline,
  WarningOutline,
  CopyOutline,
  CheckmarkCircleOutline,
  DownloadOutline
} from '@vicons/ionicons5'
import hljs from 'highlight.js'
import powershell from 'highlight.js/lib/languages/powershell'
import bash from 'highlight.js/lib/languages/bash'

hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('bash', bash)

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const deleteFormRef = ref<FormInst | null>(null)
const editFormRef = ref<FormInst | null>(null)
const scriptFormRef = ref<FormInst | null>(null)
const submitting = ref(false)
const deleteSubmitting = ref(false)
const editSubmitting = ref(false)
const generatingPassword = ref(false)
const generatingScript = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const editLoading = ref(false)
const nodesLoading = ref(false)
const donateList = ref<NodeDonate[]>([])
const deleteList = ref<NodeDeleteRequest[]>([])
const editList = ref<NodeEditRequest[]>([])
const groupOptions = ref<SelectOption[]>([])
const nodeOptions = ref<{ label: string; value: number }[]>([])
const showGuide = ref(false)
const activeTab = ref('apply')
const showDetail = ref(false)
const currentDonate = ref<NodeDonate | null>(null)
const showDeleteDetail = ref(false)
const currentDeleteRequest = ref<NodeDeleteRequest | null>(null)
const scriptFormValue = ref({
  nodeId: null as number | null,
  system: 'linux' as 'linux' | 'windows',
  arch: ''
})
const formValue = ref({
  nodeName: '',
  hostname: '',
  description: '',
  servicePort: 2333,
  adminPort: 2334,
  adminPass: '',
  allowGroup: [] as (string | number)[],
  allowPort: '10000-60000',
  allowType: []
})
const deleteFormValue = ref({
  nodeId: null as number | null,
  reason: ''
})
const editFormValue = ref({
  nodeId: null as number | null,
  nodeName: '',
  hostname: '',
  description: '',
  servicePort: 2333,
  adminPort: 2334,
  adminPass: '',
  allowGroup: [] as (string | number)[],
  allowPort: '10000-60000',
  allowType: [],
  reason: ''
})
const scriptInfo = ref<GetNodeInstallScriptResponse | null>(null)
const scriptDownloadUrl = ref('')

const passwordStrength = computed(() => {
  const password = formValue.value.adminPass || ''

  if (!password) {
    // 返回默认值而不是"无", 这样即使没有密码也会显示强度指示器
    return { percent: 0, label: '?', color: '#ccc' }
  }

  // 计算密码强度
  let strength = 0

  // 长度检查
  if (password.length >= 32) {
    strength += 40
  } else if (password.length >= 16) {
    strength += 25
  } else if (password.length >= 8) {
    strength += 10
  }

  // 复杂性检查
  if (/[A-Z]/.test(password)) strength += 20 // 大写字母
  if (/[a-z]/.test(password)) strength += 20 // 小写字母
  if (/[0-9]/.test(password)) strength += 20 // 数字

  // 返回强度级别
  if (strength >= 80) {
    return { percent: 100, label: '非常强', color: '#52c41a' }
  } else if (strength >= 60) {
    return { percent: 80, label: '强', color: '#1890ff' }
  } else if (strength >= 40) {
    return { percent: 60, label: '中等', color: '#faad14' }
  } else if (strength >= 20) {
    return { percent: 40, label: '弱', color: '#ff7875' }
  } else {
    return { percent: 20, label: '非常弱', color: '#f5222d' }
  }
})

// 获取用户组名称
const getGroupName = (groupId: string) => {
  const group = groupOptions.value.find(g => g.value === groupId)
  return group ? group.label : groupId
}

// 分页配置
const pagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    pagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const deletePagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    deletePagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const editPagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    editPagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

// 隧道类型选项
const typeOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' },
]

// 表单验证规则
const rules = {
  nodeName: {
    required: true,
    message: '请输入节点名称',
    trigger: 'blur'
  },
  hostname: {
    required: true,
    message: '请输入主机名或IP地址',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入节点描述',
    trigger: 'blur'
  },
  servicePort: {
    required: true,
    type: 'number' as const,
    message: '请输入服务端口',
    trigger: ['blur', 'change']
  },
  adminPort: {
    required: true,
    type: 'number' as const,
    message: '请输入管理端口',
    trigger: ['blur', 'change']
  },
  adminPass: {
    required: true,
    message: '请输入管理密码',
    trigger: 'blur'
  },
  allowGroup: {
    required: true,
    type: 'array' as const,
    message: '请选择允许的用户组',
    trigger: ['blur', 'change']
  },
  allowPort: {
    required: true,
    message: '请输入允许的端口范围',
    trigger: 'blur'
  },
  allowType: {
    required: true,
    type: 'array' as const,
    message: '请选择允许的隧道类型',
    trigger: ['blur', 'change']
  }
}

// 删除表单验证规则
const deleteRules = {
  nodeId: {
    type: 'number' as const,
    required: true,
    message: '请选择要删除的节点',
    trigger: ['blur', 'change']
  },
  reason: {
    type: 'string' as const,
    required: true,
    message: '请输入删除原因',
    trigger: 'blur'
  }
}

// 编辑表单验证规则
const editRules = {
  nodeId: [
    {
      required: true,
      message: '请选择要编辑的节点',
      trigger: ['blur', 'change']
    }
  ],
  nodeName: [
    {
      required: true,
      message: '请输入节点名称',
      trigger: ['blur', 'change']
    }
  ],
  hostname: [
    {
      required: true,
      message: '请输入主机名或IP地址',
      trigger: ['blur', 'change']
    }
  ],
  servicePort: [
    {
      required: true,
      type: 'number' as any,
      message: '请输入服务端口',
      trigger: ['blur', 'change']
    }
  ],
  adminPort: [
    {
      required: true,
      type: 'number' as any,
      message: '请输入管理端口',
      trigger: ['blur', 'change']
    }
  ],
  adminPass: [
    {
      required: true,
      message: '请输入管理密码',
      trigger: ['blur', 'change']
    }
  ],
  allowGroup: [
    {
      type: 'array' as any,
      required: true,
      message: '请选择允许的用户组',
      trigger: ['blur', 'change']
    }
  ],
  allowPort: [
    {
      required: true,
      message: '请输入允许的端口范围',
      trigger: ['blur', 'change']
    }
  ],
  allowType: [
    {
      type: 'array' as any,
      required: true,
      message: '请选择允许的隧道类型',
      trigger: ['blur', 'change']
    }
  ],
  reason: [
    {
      required: true,
      message: '请输入修改原因',
      trigger: ['blur', 'change']
    }
  ]
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    key: 'donateId',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.donateId)
    }
  },
  {
    title: '节点名称',
    key: 'nodeName',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeName)
    }
  },
  {
    title: '主机名/IP',
    key: 'hostname',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.hostname)
    }
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeDonate) {
      if (row.status === 0) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'warning', size: 'small' }, { default: () => '待审核' })
      } else if (row.status === 1) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'success', size: 'small' }, { default: () => '已通过' })
      } else {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'error', size: 'small' }, { default: () => '已拒绝' })
      }
    }
  },
  {
    title: '拒绝原因',
    key: 'rejectReason',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.status === 2 ? row.rejectReason : '-')
    }
  },
  {
    title: '详情',
    key: 'actions',
    render(row: NodeDonate) {
      return h(
        'div',
        {
          style: 'display: flex; gap: 8px;'
        },
        [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => showDonateDetail(row)
            },
            { default: () => '查看详情' }
          )
        ]
      )
    }
  }
]

// 删除申请表格列定义
const deleteColumns = [
  {
    title: 'ID',
    key: 'requestId',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.requestId)
    }
  },
  {
    title: '节点 ID',
    key: 'nodeId',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeId)
    }
  },
  {
    title: '删除原因',
    key: 'reason',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.reason)
    }
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeDeleteRequest) {
      if (row.status === 0) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'warning', size: 'small' }, { default: () => '待审核' })
      } else if (row.status === 1) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'success', size: 'small' }, { default: () => '已通过' })
      } else {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'error', size: 'small' }, { default: () => '已拒绝' })
      }
    }
  },
  {
    title: '拒绝原因',
    key: 'rejectReason',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.status === 2 ? row.rejectReason : '-')
    }
  },
  {
    title: '详情',
    key: 'actions',
    render(row: NodeDeleteRequest) {
      return h(
        'div',
        {
          style: 'display: flex; gap: 8px;'
        },
        [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => showDeleteRequestDetail(row)
            },
            { default: () => '查看详情' }
          )
        ]
      )
    }
  }
]

// 表格列定义
const editColumns = [
  {
    title: 'ID',
    key: 'requestId',
    render(row: NodeEditRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.requestId)
    }
  },
  {
    title: '节点名称',
    key: 'nodeName',
    render(row: NodeEditRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeName)
    }
  },
  {
    title: '主机名/IP',
    key: 'hostname',
    render(row: NodeEditRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.hostname)
    }
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeEditRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeEditRequest) {
      if (row.status === 0) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'warning', size: 'small' }, { default: () => '待审核' })
      } else if (row.status === 1) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'success', size: 'small' }, { default: () => '已通过' })
      } else {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'error', size: 'small' }, { default: () => '已拒绝' })
      }
    }
  },
  {
    title: '拒绝原因',
    key: 'rejectReason',
    render(row: NodeEditRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.status === 2 ? row.rejectReason : '-')
    }
  },
  {
    title: '详情',
    key: 'actions',
    render(row: NodeEditRequest) {
      return h(
        'div',
        {
          style: 'display: flex; gap: 8px;'
        },
        [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => showEditDetail(row)
            },
            { default: () => '查看详情' }
          )
        ]
      )
    }
  }
]

// 查看捐赠详情
const showDonateDetail = (row: NodeDonate) => {
  currentDonate.value = row
  showDetail.value = true
}

// 查看删除申请详情
const showDeleteRequestDetail = (row: NodeDeleteRequest) => {
  currentDeleteRequest.value = row
  showDeleteDetail.value = true
}

// 查看编辑申请详情
const showEditDetail = (row: NodeEditRequest) => {
  editFormValue.value = {
    nodeId: row.nodeId,
    nodeName: row.nodeName,
    hostname: row.hostname,
    description: row.description,
    servicePort: row.servicePort,
    adminPort: row.adminPort,
    adminPass: row.adminPass,
    allowGroup: row.allowGroup.split(';'),
    allowPort: row.allowPort,
    allowType: row.allowType.split(';'),
    reason: row.reason
  }
  showDetail.value = true
}

// 获取状态类型
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'error'
    default:
      return 'default'
  }
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待审核'
    case 1:
      return '已通过'
    case 2:
      return '已拒绝'
    default:
      return '未知状态'
  }
}

// 提交申请
const handleSubmit = () => {
  // 确保提交前管理员组被选中
  const adminGroup = groupOptions.value.find(group => group.value === 'admin')
  const sponsorGroup = groupOptions.value.find(group => group.value === 'sponsor')
  if (adminGroup && !formValue.value.allowGroup.includes('admin')) {
    formValue.value.allowGroup.push('admin')
  }
  if (sponsorGroup && !formValue.value.allowGroup.includes('sponsor')) {
    formValue.value.allowGroup.push('sponsor')
  }

  formRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    submitting.value = true
    try {
      const data = {
        ...formValue.value,
        allowGroup: formValue.value.allowGroup.join(';'),
        allowType: formValue.value.allowType.join(';')
      }

      const res = await applyNodeDonate(data)
      if (res.data.code === 200) {
        message.success(res.data.message || '申请提交成功')
        formRef.value?.restoreValidation()
        // 重置表单, 但保留管理员组选中状态
        formValue.value = {
          nodeName: '',
          hostname: '',
          description: '',
          servicePort: 2333,
          adminPort: 2334,
          adminPass: '',
          allowGroup: ['admin', 'sponsor'],
          allowPort: '10000-60000',
          allowType: []
        }
        // 刷新列表
        fetchDonateList()
      } else {
        message.error(res.data.message || '申请提交失败')
      }
    } catch (error) {
      message.error('申请提交失败, 请稍后重试')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 提交删除申请
const handleDeleteSubmit = () => {
  deleteFormRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    deleteSubmitting.value = true
    try {
      // 获取选中的节点ID
      const nodeId = deleteFormValue.value.nodeId

      if (nodeId === null || nodeId === undefined) {
        message.error('请选择要删除的节点')
        deleteSubmitting.value = false
        return
      }

      // 提交删除申请
      const res = await applyNodeDelete({
        nodeId: Number(nodeId), // 确保转换为数字类型
        reason: deleteFormValue.value.reason
      })

      if (res.data.code === 200) {
        message.success(res.data.message || '删除申请提交成功')
        deleteFormRef.value?.restoreValidation()
        // 重置表单
        deleteFormValue.value = {
          nodeId: null,
          reason: ''
        }
        // 刷新列表
        fetchDeleteList()
        // 重新获取节点列表
        fetchNodes()
      } else {
        message.error(res.data.message || '删除申请提交失败')
      }
    } catch (error) {
      message.error('删除申请提交失败, 请稍后重试')
      console.error(error)
    } finally {
      deleteSubmitting.value = false
    }
  })
}

// 获取捐赠申请列表
const fetchDonateList = async () => {
  loading.value = true
  try {
    const res = await getUserNodeDonates()
    if (res.data.code === 200) {
      donateList.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取申请列表失败')
    }
  } catch (error) {
    message.error('获取申请列表失败, 请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取删除申请列表
const fetchDeleteList = async () => {
  deleteLoading.value = true
  try {
    const res = await getUserNodeDeleteRequests()
    if (res.data.code === 200) {
      deleteList.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取删除申请列表失败')
    }
  } catch (error) {
    message.error('获取删除申请列表失败, 请稍后重试')
    console.error(error)
  } finally {
    deleteLoading.value = false
  }
}

// 获取用户组列表
const fetchGroups = async () => {
  try {
    const res = await AuthApi.getUserGroups()
    if (res.data.code === 200) {
      groupOptions.value = res.data.data.groups.map((group: UserGroup) => ({
        label: group.friendlyName,
        value: group.name
      }))

      // 确保管理员组始终被选中
      const adminGroup = groupOptions.value.find(group => group.value === 'admin')
      if (adminGroup && !formValue.value.allowGroup.includes('admin')) {
        formValue.value.allowGroup.push('admin')
      }

      const sponsorGroup = groupOptions.value.find(group => group.value === 'sponsor')
      if (sponsorGroup && !formValue.value.allowGroup.includes('sponsor')) {
        formValue.value.allowGroup.push('sponsor')
      }
    } else {
      message.error(res.data.message || '获取用户组列表失败')
    }
  } catch (error) {
    console.error(error)
    message.error('获取用户组列表失败, 请稍后重试')
  }
}

// 获取节点列表
const fetchNodes = async () => {
  nodesLoading.value = true
  try {
    // 获取用户的捐赠申请列表
    const res = await getUserNodeDonates()
    if (res.data.code === 200) {
      // 过滤出已通过审核的节点捐赠申请
      const approvedDonations = (res.data.data || []).filter((donation: NodeDonate) => donation.status === 1)

      // 将已通过的捐赠申请转换为节点选项
      nodeOptions.value = approvedDonations.map((donation: NodeDonate) => {
        // 确保nodeId是数字类型
        const nodeId = donation.nodeId && donation.nodeId > 0
          ? Number(donation.nodeId)
          : Number(donation.donateId)

        return {
          label: `#${nodeId} ${donation.nodeName} (${donation.hostname})`,
          value: nodeId
        }
      })

      // 如果节点列表为空, 显示提示信息
      if (approvedDonations.length === 0 && activeTab.value === 'delete') {
        message.info('您目前没有已通过审核的捐赠节点可删除')
      }
    }
  } catch (error) {
    console.error(error)
    message.error('获取节点列表失败, 请稍后重试')
  } finally {
    nodesLoading.value = false
  }
}

// 监听用户组选项变化, 确保管理员组始终被选中
watch(groupOptions, (newOptions) => {
  const adminGroup = newOptions.find(group => group.value === 'admin')
  if (adminGroup && !formValue.value.allowGroup.includes('admin')) {
    formValue.value.allowGroup.push('admin')
  }
  const sponsorGroup = newOptions.find(group => group.value === 'sponsor')
  if (sponsorGroup && !formValue.value.allowGroup.includes('sponsor')) {
    formValue.value.allowGroup.push('sponsor')
  }
}, { deep: true })

// 监听标签页变化
watch(activeTab, (newTab) => {
  if (newTab === 'delete') {
    // 当切换到删除节点标签页时, 重新获取节点列表
    fetchNodes()
  }
})

// 生成随机密码
const generateRandomPassword = async () => {
  generatingPassword.value = true
  try {
    // 使用Web Crypto API生成随机密码
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)

    const password = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // 设置到表单
    formValue.value.adminPass = password
    return { data: { code: 200, data: { password } } }
  } catch (error) {
    message.error('密码生成失败, 请重试')
    console.error(error)
    return { data: { code: 500, message: '密码生成失败' } }
  } finally {
    generatingPassword.value = false
  }
}

// 复制密码到剪贴板
const copyPassword = () => {
  if (!formValue.value.adminPass) {
    message.warning('请先生成或输入密码')
    return
  }

  try {
    navigator.clipboard.writeText(formValue.value.adminPass)
    message.success('密码已复制到剪贴板')
  } catch (error) {
    message.error('复制失败, 请手动复制')
    console.error('复制密码错误:', error)
  }
}

// 提交编辑申请
const handleEditSubmit = () => {
  // 确保管理员组和赞助者组始终被选中
  const adminGroup = groupOptions.value.find(group => group.value === 'admin')
  const sponsorGroup = groupOptions.value.find(group => group.value === 'sponsor')
  if (adminGroup && !editFormValue.value.allowGroup.includes('admin')) {
    editFormValue.value.allowGroup.push('admin')
  }
  if (sponsorGroup && !editFormValue.value.allowGroup.includes('sponsor')) {
    editFormValue.value.allowGroup.push('sponsor')
  }

  editFormRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    editSubmitting.value = true
    try {
      const data = {
        ...editFormValue.value,
        allowGroup: editFormValue.value.allowGroup.join(';'),
        allowType: editFormValue.value.allowType.join(';')
      }

      const res = await applyNodeEdit(data)
      if (res.data.code === 200) {
        message.success(res.data.message || '编辑申请提交成功')
        editFormRef.value?.restoreValidation()
        // 重置表单, 但保留管理员组选中状态
        editFormValue.value = {
          nodeId: null,
          nodeName: '',
          hostname: '',
          description: '',
          servicePort: 2333,
          adminPort: 2334,
          adminPass: '',
          allowGroup: ['admin', 'sponsor'],
          allowPort: '10000-60000',
          allowType: [],
          reason: ''
        }
        // 刷新列表
        fetchEditList()
      } else {
        message.error(res.data.message || '编辑申请提交失败')
      }
    } catch (error) {
      message.error('编辑申请提交失败, 请稍后重试')
      console.error(error)
    } finally {
      editSubmitting.value = false
    }
  })
}

// 生成编辑表单密码
const generateEditPassword = async () => {
  generatingPassword.value = true
  try {
    // 使用Web Crypto API生成随机密码
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)

    const password = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // 设置到表单
    editFormValue.value.adminPass = password
    return { data: { code: 200, data: { password } } }
  } catch (error) {
    message.error('密码生成失败, 请重试')
    console.error(error)
    return { data: { code: 500, message: '密码生成失败' } }
  } finally {
    generatingPassword.value = false
  }
}

// 复制编辑表单密码到剪贴板
const copyEditPassword = () => {
  if (!editFormValue.value.adminPass) {
    message.warning('请先生成或输入密码')
    return
  }

  try {
    navigator.clipboard.writeText(editFormValue.value.adminPass)
    message.success('密码已复制到剪贴板')
  } catch (error) {
    message.error('复制失败, 请手动复制')
    console.error(error)
  }
}

// 处理节点选择
const handleNodeSelect = async (nodeId: number | null) => {
  if (!nodeId) {
    // 清空表单
    editFormValue.value = {
      nodeId: null,
      nodeName: '',
      hostname: '',
      description: '',
      servicePort: 2333,
      adminPort: 2334,
      adminPass: '',
      allowGroup: ['admin', 'sponsor'],
      allowPort: '10000-60000',
      allowType: [],
      reason: ''
    }
    return
  }

  // 查找选中的节点
  const selectedNode = donateList.value.find(node => node.nodeId === nodeId)
  if (selectedNode) {
    // 填充表单
    editFormValue.value = {
      nodeId: selectedNode.nodeId,
      nodeName: selectedNode.nodeName,
      hostname: selectedNode.hostname,
      description: selectedNode.description,
      servicePort: selectedNode.servicePort,
      adminPort: selectedNode.adminPort,
      adminPass: selectedNode.adminPass,
      allowGroup: selectedNode.allowGroup.split(';'),
      allowPort: selectedNode.allowPort,
      allowType: selectedNode.allowType.split(';'),
      reason: ''
    }
  }
}

// 获取编辑申请列表
const fetchEditList = async () => {
  editLoading.value = true
  try {
    const res = await getUserNodeEditRequests()
    if (res.data.code === 200) {
      // 将NodeEditRequest类型转换为组件需要的类型
      editList.value = res.data.data || []
      editPagination.pageCount = Math.ceil(editList.value.length / 10)
    } else {
      message.error(res.data.message || '获取编辑申请列表失败')
    }
  } catch (error) {
    message.error('获取编辑申请列表失败, 请稍后重试')
    console.error(error)
  } finally {
    editLoading.value = false
  }
}

// 切换用户组选择
const toggleGroup = (value: string | number) => {
  // 如果是管理员组, 确保它始终被选中
  if (value === 'admin') {
    if (!formValue.value.allowGroup.includes(value)) {
      formValue.value.allowGroup.push(value)
    }
    return
  }

  if (value === 'sponsor') {
    if (!formValue.value.allowGroup.includes(value)) {
      formValue.value.allowGroup.push(value)
    }
    return
  }

  const index = formValue.value.allowGroup.indexOf(value)
  if (index === -1) {
    formValue.value.allowGroup.push(value)
  } else {
    formValue.value.allowGroup.splice(index, 1)
  }
}

// 切换编辑表单用户组选择
const toggleEditGroup = (value: string | number) => {
  // 如果是管理员组, 确保它始终被选中
  if (value === 'admin') {
    if (!editFormValue.value.allowGroup.includes(value)) {
      editFormValue.value.allowGroup.push(value)
    }
    return
  }

  if (value === 'sponsor') {
    if (!editFormValue.value.allowGroup.includes(value)) {
      editFormValue.value.allowGroup.push(value)
    }
    return
  }

  const index = editFormValue.value.allowGroup.indexOf(value)
  if (index === -1) {
    editFormValue.value.allowGroup.push(value)
  } else {
    editFormValue.value.allowGroup.splice(index, 1)
  }
}

// 切换隧道协议选择
const toggleProtocol = (value: string) => {
  const index = formValue.value.allowType.indexOf(value)
  if (index === -1) {
    formValue.value.allowType.push(value)
  } else {
    formValue.value.allowType.splice(index, 1)
  }
}

// 切换编辑表单隧道协议选择
const toggleEditProtocol = (value: string) => {
  const index = editFormValue.value.allowType.indexOf(value)
  if (index === -1) {
    editFormValue.value.allowType.push(value)
  } else {
    editFormValue.value.allowType.splice(index, 1)
  }
}

// 生成安装脚本
const handleGenerateScript = async () => {
  try {
    await scriptFormRef.value?.validate()
    generatingScript.value = true
    
    if (!scriptFormValue.value.nodeId) {
      message.error('请选择节点')
      return
    }
    
    const res = await getNodeInstallScript({
      nodeId: String(scriptFormValue.value.nodeId), // 转换为字符串类型
      system: scriptFormValue.value.system,
      arch: scriptFormValue.value.arch
    })
    
    if (res.data.code === 200) {
      scriptInfo.value = res.data.data
      scriptDownloadUrl.value = res.data.data.downloadUrl
      message.success(res.data.message || '脚本生成成功')
    } else {
      message.error(res.data.message || '脚本生成失败')
    }
  } catch (error) {
    message.error('脚本生成失败, 请稍后重试')
    console.error(error)
  } finally {
    generatingScript.value = false
  }
}

// 复制脚本下载链接到剪贴板
const copyScriptUrl = () => {
  if (!scriptDownloadUrl.value) {
    message.warning('请先生成脚本')
    return
  }

  try {
    navigator.clipboard.writeText(scriptDownloadUrl.value)
    message.success('脚本下载链接已复制到剪贴板')
  } catch (error) {
    message.error('复制失败, 请手动复制')
    console.error('复制脚本下载链接错误:', error)
  }
}

// 下载脚本
const downloadScript = () => {
  if (!scriptInfo.value || !scriptInfo.value.scriptId) {
    message.warning('请先生成脚本')
    return
  }

  // 创建一个a标签, 模拟点击下载
  const link = document.createElement('a')
  link.href = scriptDownloadUrl.value
  link.target = '_blank'
  link.click()
}

// 重置脚本生成表单
const resetScriptForm = () => {
  scriptFormValue.value = {
    nodeId: null,
    system: 'linux' as 'linux' | 'windows',
    arch: ''
  }
  
  // 重新设置默认架构
  setTimeout(() => {
    const options = archOptions.value
    if (options.length > 0) {
      scriptFormValue.value.arch = options[0].value
    }
  }, 0)
  
  scriptInfo.value = null
  scriptDownloadUrl.value = ''
}

// 获取一键安装命令
const getInstallCommand = computed(() => {
  if (!scriptInfo.value || !scriptInfo.value.scriptId) {
    return ''
  }

  const downloadUrl = scriptDownloadUrl.value
  
  if (scriptFormValue.value.system === 'linux') {
    return `wget -O install.sh "${downloadUrl}" && chmod +x install.sh && bash install.sh`
  } else {
    // Windows PowerShell命令, 使用Set-ExecutionPolicy绕过执行策略限制
    return `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iwr -useb "${downloadUrl}" | iex`
  }
})

// 复制安装命令到剪贴板
const copyInstallCommand = () => {
  if (!getInstallCommand.value) {
    message.warning('请先生成脚本')
    return
  }

  try {
    navigator.clipboard.writeText(getInstallCommand.value)
    message.success('安装命令已复制到剪贴板')
  } catch (error) {
    message.error('复制失败, 请手动复制')
    console.error('复制安装命令错误:', error)
  }
}

// 系统架构信息
const products = ref<Product[]>([])
const loadingArchs = ref(false)

// 计算属性：根据系统类型获取架构选项
const archOptions = computed(() => {
  const system = scriptFormValue.value.system
  
  // 过滤出MEFrps产品, 并且系统类型匹配
  const filteredProducts = products.value.filter(p => 
    p.productId.includes('MEFrp_Next') && 
    p.system.includes(system)
  )
  
  if (filteredProducts.length === 0) {
    return []
  }
  
  // 参考 Downloads.vue 的处理方式，从 arch 字段中提取架构信息
  // 架构格式：windows:386/amd64/arm/arm64|darwin:amd64/arm64|linux:386/amd64/arm/arm64|android:arm64
  const archMap = new Map()
  
  filteredProducts.forEach(product => {
    if (!product.arch) return
    
    product.arch.split('|').forEach(item => {
      const [sys, archs] = item.split(':')
      if (sys === system) {
        archMap.set(sys, archs.split('/'))
      }
    })
  })
  
  // 获取当前系统的架构列表
  const archs = archMap.get(system) || []
  
  // 转换为选项格式
  return archs.map(arch => {
    let label = arch
    
    // 为常见架构添加友好名称
    if (arch === 'x86_64') label = 'x86_64 (64 位)'
    else if (arch === 'amd64') label = 'amd64 (64 位)'
    else if (arch === 'i386') label = 'i386 (32 位)'
    else if (arch === '386') label = '386 (32 位)'
    else if (arch === 'arm64') label = 'arm64 (ARM64)'
    else if (arch === 'armv7') label = 'armv7 (ARM)'
    else if (arch === 'arm') label = 'arm (ARM)'
    
    return { label, value: arch }
  })
})

// 监听系统类型变化, 自动选择第一个架构
watch(() => scriptFormValue.value.system, (_newSystem) => {
  // 使用计算属性中的逻辑获取架构选项
  const options = archOptions.value
  
  if (options.length > 0) {
    scriptFormValue.value.arch = options[0].value
  } else {
    scriptFormValue.value.arch = ''
  }
})

// 获取系统架构信息
const fetchProducts = async () => {
  loadingArchs.value = true
  try {
    const res = await AuthApi.getProducts()
    if (res.data.code === 200) {
      products.value = res.data.data || []
      
      // 设置默认架构
      setTimeout(() => {
        const options = archOptions.value
        if (options.length > 0) {
          scriptFormValue.value.arch = options[0].value
        }
      }, 0)
    } else {
      message.error(res.data.message || '获取产品信息失败')
    }
  } catch (error) {
    console.error(error)
    message.error('获取产品信息失败, 请稍后重试')
  } finally {
    loadingArchs.value = false
  }
}

onMounted(() => {
  fetchDonateList()
  fetchDeleteList()
  fetchEditList()
  fetchGroups()
  fetchNodes()
  fetchProducts()

  // 确保管理员组始终被选中, 即使在组件重新挂载时
  setTimeout(() => {
    const adminGroup = groupOptions.value.find(group => group.value === 'admin')
    if (adminGroup && !formValue.value.allowGroup.includes('admin')) {
      formValue.value.allowGroup.push('admin')
    }
  }, 500)
})
</script>

<style lang="scss" scoped>
@use '../../../assets/styles/variables' as *;


.donate-card {
  margin-bottom: 20px;
}

:deep(.n-button-group) {
  flex-wrap: wrap;
}

:deep(.n-data-table-td) {
  padding: 10px 12px;
}

:deep(.n-card-header) {
  padding: 16px 20px;
}

:deep(.n-card__content) {
  padding: 0 16px 16px;
}

.form-tip {
  font-size: 12px;
  color: $text-color-3;
  margin-top: 4px;
  margin-bottom: 8px;
}

.password-strength {
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 8px;

  .strength-bar {
    height: 6px;
    background-color: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;

    .strength-level {
      height: 100%;
      border-radius: 3px;
      transition: all 0.3s ease;
    }
  }

  .strength-text {
    width: 100px;
    font-size: 12px;
    color: $text-color-3;
  }
}

.modal-info-item {
  display: flex;
  margin-bottom: 14px;
  line-height: 1.5;

  .label {
    width: 140px;
    font-weight: 500;
    color: $text-color-2;
    text-align: right;
    padding-right: 16px;
  }

  .value {
    flex: 1;
    word-break: break-all;
  }
}


.modal-section {
  margin-bottom: 24px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--n-border-color);
    opacity: 0.5;
  }

  .section-title {
    font-weight: 500;
    margin-bottom: 16px;
    font-size: 15px;
    color: var(--n-title-text-color);
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background-color: var(--n-primary-color);
      border-radius: 2px;
    }
  }
}

.modal-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-title-text-color);
}

:deep(.n-modal) {
  .n-card-header {
    padding: 16px 20px;
    font-weight: 500;
    font-size: 16px;
    border-bottom: 1px solid var(--n-border-color);
  }

  .n-card__content {
    padding: 0 20px 20px;
  }

  .n-card__action {
    padding: 12px 20px;
    background-color: var(--n-color-modal);
    border-top: 1px solid var(--n-border-color);
  }

  .n-divider {
    margin: 16px 0;
  }
}

:deep(.n-button) {
  &.n-button--primary-type {
    font-weight: 500;
  }
}

:deep(.n-tag) {
  padding: 0 8px;
}
</style>
