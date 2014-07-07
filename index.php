<style>
    ul{
        position: absolute;
        list-style: none;
    }
    a{
        text-decoration: none;
        display: inline-block;
        width: 100%;
    }
    li{
        padding: 1px 5px;
    }
    .dir a{
        color: #0A0;
        font-weight: bold;
    }
    .file a{
        color: #00A;
    }
    li:hover{
        background: radial-gradient(#FFF 0, #ADF 100%);
        border-radius: 3px;
    }
</style>
<body>
    <ul>
        <?php
        $dir = './';
        $ds = array();
        $fs = array();
        $hidden = array('.', '..', 'index.php', 'loveU', 'hide');

        // Open a known directory, and proceed to read its contents
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if (!in_array($file, $hidden)) {
                    if (filetype($dir . $file) == 'dir') $ds[] = $file;
                    if (filetype($dir . $file) == 'file') $fs[] = $file;
                }
            }
            closedir($dh);
        }
        sort($ds);
        sort($fs);
        foreach ($ds as $e)
            echo "<li class='dir'><a href='$e'>$e</a></li>";
        
        foreach ($fs as $e)
            echo "<li class='file'><a href='$e'>$e</a></li>";
        ?>
    </ul>
</body>