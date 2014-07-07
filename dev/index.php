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
        border: 1px solid transparent;
        width: 300px;
    }
    .dir a{
        color: #0A0;
        font-weight: bold;
    }
    .file a{
        color: #00A;
    }
    li:hover{
        background: rgba(110, 190, 230, .3);
        border: 1px solid #70C0E7;
    }
</style>
<body>
    <ul>
        <?php
        $dir = './';
        $ds = array();
        $fs = array();
        $hidden = array('.', 'index.php', 'loveU', 'hide');

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