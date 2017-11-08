<template>
    <div>

        <div>
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
                        @click="selectMenu(index,$event)">
                        <span class="text border-1px">
                            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>