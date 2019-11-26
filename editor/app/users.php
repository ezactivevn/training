<?php

require  __DIR__ . '/../config.php';

// Alias Editor classes so they are easy to use
use
    DataTables\Editor,
    DataTables\Editor\Field,
    DataTables\Editor\Format,
    DataTables\Editor\Mjoin,
    DataTables\Editor\Options,
    DataTables\Editor\Upload,
    DataTables\Editor\Validate,
    DataTables\Editor\ValidateOptions;

// Build our Editor instance and process the data coming from _POST
Editor::inst($db, 'users')
    ->fields(
        Field::inst('users.id'),
        Field::inst('users.first_name')
            ->validator( Validate::notEmpty() ),
        Field::inst('users.last_name')
            ->validator( Validate::required() ),
        Field::inst('users.mobile')
            ->validator( Validate::required() ),
        Field::inst('users.email')
            ->validator( Validate::required() )
            ->validator( Validate::unique( ValidateOptions::inst()
                ->message( 'This email address is already being used' )  
            ) )
            ->validator( Validate::email( ValidateOptions::inst()
                ->message( 'Please enter an e-mail address' )  
            ) ),
        Field::inst('users.password')
            ->validator( Validate::required())
            ->validator( Validate::minLen(
                5,
                ValidateOptions::inst()
                    ->message('Invalid password, minimum length 5')
            ) )
            ->setFormatter( function($val) {
                error_log('set');
                if ($_POST['action'] == 'create') {
                    return password_hash($val, PASSWORD_DEFAULT);
                }
                return $val;
            } ),
        Field::inst('users.role')
            ->validator( Validate::required() ),
        Field::inst('users.created_at'),
        Field::inst('users.last_logon')
    )
    ->process($_POST)
    ->json();
